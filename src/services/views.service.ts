import publicacionService from './Publicacion.service';
import propiedadService from './propiedad.service';
import userService from './user.service';

export interface PublicacionContainer {
  idPublicacion: number;
  titulo: String;
  precio: Number;
  ciudad: string;
  habitaciones: number;
  banos: number;
  metraje: number;
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
  tipoVentas: String;
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
}

class ViewsService {
  async getDetallePublicacion(id: string, token?: string): Promise<PublicacionDetalle | string> {
    try {
      // 1. Obtener Publicación
      const pub = await publicacionService.getPublicacionByid(id);

      // 2. Obtener Propiedad, Vendedor y Reseñas en paralelo
      const [propiedad, vendedor, resenasRaw] = await Promise.all([
        propiedadService.getPropertyById(pub.propiedadId.toString()).catch(() => null),
        userService.getUserById(pub.vendedorId.toString(), token).catch(() => null),
        import('./resenas.service').then(m => m.default.listarPorPublicacion(pub.idpublicacion.toString()).catch(() => []))
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
        idPublicacion: pub.idpublicacion,
        titulo: pub.titulo,
        descripcion: pub.descripcion,
        precio: pub.precio,
        fechaPublicacion: pub.fechaPublicacion,
        tipoVentas: pub.tipoVentas,
        nombreVendedor: nombreVendedor,
        propiedad: {
          id: propiedad.propiedadId,
          direccion: propiedad.direccion,
          ciudad: propiedad.ciudad,
          habitaciones: propiedad.cantidadHabitaciones,
          banos: propiedad.cantidadBaños,
          metraje: propiedad.metraje,
          tipo: propiedad.tipo
        },
        resenas: resenasConNombre
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
              idPublicacion: pub.idpublicacion,
              titulo: pub.titulo,
              precio: pub.precio, // Precio de la publicación
              ciudad: propiedad.ciudad?.nombre || propiedad.ciudad,
              habitaciones: propiedad.cantidadHabitaciones,
              banos: propiedad.cantidadBaños,
              metraje: propiedad.metraje
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
