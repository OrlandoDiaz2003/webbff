import publicacionService from './Publicacion.service';
import propiedadService from './propiedad.service';
import userService from './user.service';
import agendaService from './agenda.service';

export interface PublicacionContainer {
  idPublicacion: number;
  titulo: String;
  precio: Number;
  ciudad: string;
  habitaciones: number;
  banos: number;
  metraje: number;
  fotos?: any[];
}

export interface ResenaDetalle {
  id: number;
  contenido: string;
  calificacion: number;
  nombreCliente: string;
}

export interface PublicacionDetalle {
  idPublicacion: number;
  titulo: String;
  descripcion: String;
  precio: Number;
  fechaPublicacion: string;
  nombreVendedor: string;
  propiedad: {
    id: number;
    direccion: string;
    ciudad: string;
    habitaciones: number;
    banos: number;
    metraje: number;
    tipo: string;
  };
  resenas: ResenaDetalle[];
  fotos?: any[];
}

export interface AgendaHistorialItem {
  idAgenda?: number;
  clienteMensaje: string;
  vendedorMensaje?: string;
  estadoCita: string;
  fecha: string;
  publicacion: {
    id: number;
    titulo: string;
    precio: number;
    ubicacion: string;
    ciudad: string;
    fotoPrincipal?: string;
  };
  participante: {
    id: number;
    nombre: string;
    rol: 'vendedor' | 'cliente';
  };
}

class ViewsService {
  async getAgendaHistorial(userId: string, role: string, token?: string): Promise<AgendaHistorialItem[]> {
    try {
      // 1. Obtener la agenda según el rol
      const agendaRaw = role.toLowerCase() === 'vendedor' 
        ? await agendaService.getByVendedor(userId)
        : await agendaService.getByCliente(userId);

      // 2. Enriquecer cada entrada
      const historial = await Promise.all(
        agendaRaw.map(async (item: any) => {
          try {
            // Obtener Publicación y Propiedad en paralelo
            const pub = await publicacionService.getPublicacionByid(item.idPublicacion.toString());
            const prop = await propiedadService.getPropertyById(pub.propiedadId.toString());
            
            // Identificar al otro participante (si soy vendedor, busco al cliente; si soy cliente, busco al vendedor)
            const idOtro = role.toLowerCase() === 'vendedor' ? item.idCliente : item.idVendedor;
            const rolOtro = role.toLowerCase() === 'vendedor' ? 'cliente' : 'vendedor';
            
            const otroUserRes: any = await userService.getUserById(idOtro.toString(), token);
            const nombreOtro = otroUserRes.usuario?.nombre || otroUserRes.nombre || "Usuario Desconocido";

            return {
              idAgenda: item.idAgenda || item.IdAgenda || item.id,
              clienteMensaje: item.clienteMensaje,
              vendedorMensaje: item.vendedorMensaje,
              estadoCita: item.estadoCita,
              fecha: item.fecha,
              publicacion: {
                id: pub.idPublicacion,
                titulo: pub.titulo,
                precio: pub.precio,
                ubicacion: pub.ubicacion,
                ciudad: prop.ciudad?.nombre || prop.ciudad,
                fotoPrincipal: pub.fotos?.[0]?.url
              },
              participante: {
                id: idOtro,
                nombre: nombreOtro,
                rol: rolOtro as 'vendedor' | 'cliente'
              }
            };
          } catch (error) {
            console.error(`Error enriqueciendo item de agenda:`, error);
            // Devolver datos mínimos si falla el enriquecimiento
            return {
              clienteMensaje: item.clienteMensaje || "",
              vendedorMensaje: item.vendedorMensaje || "",
              estadoCita: item.estadoCita,
              fecha: item.fecha,
              publicacion: { id: item.idPublicacion, titulo: "Cargando...", precio: 0, ubicacion: "", ciudad: "" },
              participante: { id: 0, nombre: "Desconocido", rol: 'cliente' as const }
            };
          }
        })
      );

      return historial;
    } catch (error: any) {
      console.error("Error en getAgendaHistorial:", error.message);
      throw new Error("Error al obtener el historial de agenda");
    }
  }

  async getDetallePublicacion(id: string, token?: string): Promise<PublicacionDetalle | string> {
    try {
      // 1. Obtener Publicación
      const pub = await publicacionService.getPublicacionByid(id);

      // 2. Obtener Propiedad, Vendedor y Reseñas en paralelo
      const [propiedad, vendedor, resenasRaw] = await Promise.all([
        propiedadService.getPropertyById(pub.propiedadId.toString()).catch(() => null),
        userService.getUserById(pub.vendedorId.toString(), token).catch(() => null),
        import('./resenas.service').then(m => m.default.listarPorPublicacion(pub.idPublicacion.toString()).catch(() => []))
      ]);

      if (!propiedad) throw new Error("La propiedad asociada no existe.");

      // 3. Mapear nombres de clientes en las reseñas
      const resenasConNombre = await Promise.all(
        resenasRaw.map(async (r: any) => {
          try {
            const clienteRes: any = await userService.getUserById(r.usuarioId.toString(), token);
            // El servicio de usuario puede devolver el objeto directamente o dentro de .usuario
            const nombre = clienteRes.usuario?.nombre || clienteRes.nombre || "Usuario Desconocido";
            return {
              id: r.idResenas || r.id,
              contenido: r.comentario || "Sin contenido",
              calificacion: r.calificacion || 0,
              nombreCliente: nombre
            };
          } catch (e) {
            return {
              id: r.idResenas || r.id,
              contenido: r.comentario || "Sin contenido",
              calificacion: r.calificacion || 0,
              nombreCliente: "Usuario Anónimo"
            };
          }
        })
      );

      // Normalizar nombre del vendedor
      const nombreVendedor = vendedor?.usuario?.nombre || (vendedor as any)?.nombre || "Vendedor Privado";

      return {
        idPublicacion: pub.idPublicacion,
        titulo: pub.titulo,
        descripcion: pub.descripcion,
        precio: pub.precio,
        fechaPublicacion: pub.fechaPublicacion,
        nombreVendedor: nombreVendedor,
        propiedad: {
          id: propiedad.idPropiedad,
          direccion: propiedad.direccion,
          ciudad: propiedad.ciudad,
          habitaciones: propiedad.cantidadHabitaciones,
          banos: propiedad.cantidadBaños,
          metraje: propiedad.metraje,
          tipo: propiedad.tipo
        },
        resenas: resenasConNombre,
        fotos: pub.fotos || []
      };

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Error desconocido";
      console.error("Error en ViewsService (Detalle):", errorMsg);
      return `Error al obtener el detalle de la publicación: ${errorMsg}`;
    }
  }

  async getPublicacionesParaContenedores(): Promise<PublicacionContainer[] | string> {
    try {
      // 1. Obtener todas las publicaciones
      const publicaciones = await publicacionService.getPublicacionAll();

      if (!publicaciones || publicaciones.length === 0) {
        return "No hay publicaciones disponibles";
      }

      // 2. Por cada publicación, obtener los detalles de su propiedad en paralelo
      const contenedores = await Promise.all(
        publicaciones.map(async (pub) => {
          try {
            const propiedad = await propiedadService.getPropertyById(pub.propiedadId.toString());

            return {
              idPublicacion: pub.idPublicacion,
              titulo: pub.titulo,
              precio: pub.precio, // Precio de la publicación
              ciudad: propiedad.ciudad?.nombre || propiedad.ciudad,
              habitaciones: propiedad.cantidadHabitaciones,
              banos: propiedad.cantidadBaños,
              metraje: propiedad.metraje,
              fotos: pub.fotos || []
            };
          } catch (error) {
            // Si falla una propiedad, devolvemos datos parciales o null para filtrar después
            console.error(`Error obteniendo propiedad ${pub.propiedadId}:`, error);
            return null;
          }
        })
      );

      // Filtrar las que fallaron y retornar
      return contenedores.filter((c) => c !== null) as PublicacionContainer[];
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Error desconocido";
      console.error("Error en ViewsService:", errorMsg);
      return `Error al obtener publicaciones: ${errorMsg}`;
    }
  }
}

export default new ViewsService();
