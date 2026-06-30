import { Request, Response } from "express";
import publicacionService from "../services/Publicacion.service";
import propiedadService from "../services/propiedad.service";

export const getAllPublicaciones = async (req: Request, res: Response) => {
  try {
    const publicaciones = await publicacionService.getPublicacionAll();
    res.json(publicaciones);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const publicacion = await publicacionService.getPublicacionByid(
      id as string,
    );
    res.json(publicacion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const crearPublicacion = async (req: Request, res: Response) => {
  try {
    const property = await publicacionService.crearPublicacion(req.body);
    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
export const crearPublicacionCompleta = async (req: Request, res: Response) => {
  const { propiedad, publicacion } = req.body;
  let createdPropiedadId: number | null = null;

  try {
    // 1. Crear la propiedad primero
    const propertyData = {
      direccion: propiedad.direccion,
      cantidadBaños: propiedad.cantidadBaños,
      cantidadHabitaciones: propiedad.cantidadHabitaciones,
      metraje: propiedad.metraje,
      idVendedor: propiedad.idVendedor,
      idTipoPropiedad: propiedad.idTipoPropiedad,
      idEstadoPropiedad: propiedad.idEstadoPropiedad,
      idCiudad: propiedad.idCiudad,
      numeroUnidad: propiedad.numeroUnidad || "",
    };

    console.log("Creando propiedad con datos:", propertyData);
    const createdPropiedad =
      await propiedadService.crearPropiedad(propertyData);
    createdPropiedadId = createdPropiedad.idPropiedad;

    // 2. Intentar crear la publicación vinculada
    try {
      const publicationData = {
        titulo: publicacion.titulo,
        descripcion: publicacion.descripcion,
        precio: publicacion.precio,
        ubicacion: publicacion.ubicacion,
        vendedorId: publicacion.vendedorId,
        propiedadId: createdPropiedadId,
      };

      console.log("Creando publicación con datos:", publicationData);
      const createdPublicacion =
        await publicacionService.crearPublicacion(publicationData);

      // Respuesta exitosa: Incluimos el ID de la publicación para que el front redireccione
      res.status(201).json({
        message: "Publicación y propiedad creadas exitosamente",
        idPublicacion: createdPublicacion.idPublicacion,
        redirectUrl: `/propiedades/${createdPublicacion.idPublicacion}`, // Ajustado a la ruta solicitada por el usuario
        publicacion: createdPublicacion,
        propiedad: createdPropiedad,
      });
    } catch (pubError: any) {
      // ROLLBACK: Si falla la publicación, eliminamos la propiedad para no dejar datos huérfanos
      console.error(
        "Fallo la creación de publicación, ejecutando rollback de propiedad...",
      );
      if (createdPropiedadId) {
        await propiedadService.eliminarPropiedad(createdPropiedadId.toString());
        console.log(
          `Propiedad ${createdPropiedadId} eliminada correctamente por rollback.`,
        );
      }
      throw pubError; // Re-lanzamos para que lo capture el catch principal
    }
  } catch (error: any) {
    console.error("Error en orquestador de publicación:", error.message);
    res.status(500).json({
      error:
        error.message || "Error en la orquestación de creación de publicación",
      rollbackExecuted: !!createdPropiedadId,
    });
  }
};

export const eliminarPublicacionCompleta = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params; // ID de la publicación
  const { vendedorId } = req.body; // Enviado desde el front para validar

  try {
    // 1. Obtener la publicación para conocer el propiedadId y validar el vendedor
    const publicacion = await publicacionService.getPublicacionByid(
      id as string,
    );

    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // 2. Validar que el vendedorId coincida
    if (publicacion.vendedorId !== Number(vendedorId)) {
      return res.status(403).json({
        error:
          "No tienes permiso para eliminar esta publicación. El ID de vendedor no coincide.",
      });
    }

    const propiedadId = publicacion.propiedadId;

    // 3. Borrado en cascada
    console.log(`Iniciando borrado en cascada para publicación ${id}...`);

    // A. Eliminar Reseñas (Opcional: Si el servicio falla porque no hay reseñas, continuamos)
    try {
      // Importación dinámica para evitar dependencias circulares si las hubiera
      const resenasService = (await import("../services/resenas.service"))
        .default;

      // Obtenemos las reseñas primero para borrarlas una a una o por lote si el servicio lo permite
      const resenas = await resenasService.listarPorPublicacion(id as string);
      for (const resena of resenas) {
        const resenaId = (resena as any).idResenas || (resena as any).id;
        await resenasService.eliminarResena(resenaId.toString());
      }
      console.log(`Reseñas de la publicación ${id} eliminadas.`);
    } catch (e: any) {
      console.log("No se eliminaron reseñas o no existían:", e.message);
    }

    // B. Eliminar la Publicación
    await publicacionService.deletePublicacion(id as string);
    console.log(`Publicación ${id} eliminada.`);

    // C. Eliminar la Propiedad
    if (propiedadId) {
      await propiedadService.eliminarPropiedad(propiedadId.toString());
      console.log(`Propiedad ${propiedadId} eliminada.`);
    }

    res.json({
      message: "Eliminación en cascada completada exitosamente",
      detalles: {
        publicacionId: id,
        propiedadId: propiedadId,
        vendedorId: vendedorId,
      },
    });
  } catch (error: any) {
    console.error("Error en eliminación en cascada:", error.message);
    res.status(500).json({
      error: error.message || "Error al procesar la eliminación en cascada",
    });
  }
};

export const patchPublication = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const publicacion = await publicacionService.updatePublicacion(
      id as string,
      req.body,
    );
    res.json(publicacion);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const deletePublication = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await publicacionService.deletePublicacion(id as string);
    res.json({ message: `publicacion eliminada` });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar publicacion",
    );
  }
};

export const subirFoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const foto = req.file;

  if (!foto) {
    return res.status(400).json({ error: "El archivo no puede estar vacío" });
  }

  try {
    const fotoGuardada = await publicacionService.subirFoto(id as string, foto);
    res.status(201).json(fotoGuardada);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const crearPublicacionConFotos = async (req: Request, res: Response) => {
  const fotos = req.files as Express.Multer.File[];
  let data;

  try {
    data = JSON.parse(req.body.data);
  } catch (e) {
    return res
      .status(400)
      .json({ error: "El campo 'data' debe ser un JSON válido" });
  }

  const { propiedad, publicacion } = data;
  let createdPropiedadId: number | null = null;
  let createdPublicacionId: number | null = null;

  try {
    // 1. Crear la propiedad
    const propertyData = {
      direccion: propiedad.direccion,
      cantidadBaños: propiedad.cantidadBaños,
      cantidadHabitaciones: propiedad.cantidadHabitaciones,
      metraje: propiedad.metraje,
      idVendedor: propiedad.idVendedor,
      idTipoPropiedad: propiedad.idTipoPropiedad,
      idEstadoPropiedad: propiedad.idEstadoPropiedad,
      idCiudad: propiedad.idCiudad,
      numeroUnidad: propiedad.numeroUnidad || "",
    };

    const createdPropiedad =
      await propiedadService.crearPropiedad(propertyData);
    createdPropiedadId = createdPropiedad.idPropiedad;

    // 2. Crear la publicación
    const publicationData = {
      titulo: publicacion.titulo,
      descripcion: publicacion.descripcion,
      precio: publicacion.precio,
      ubicacion: publicacion.ubicacion,
      vendedorId: publicacion.vendedorId,
      propiedadId: createdPropiedadId!,
    };

    const createdPublicacion =
      await publicacionService.crearPublicacion(publicationData);
    createdPublicacionId = createdPublicacion.idPublicacion;

    // 3. Subir fotos (si existen)
    const fotosResultados = [];
    if (fotos && fotos.length > 0) {
      for (const foto of fotos) {
        try {
          const resultado = await publicacionService.subirFoto(
            createdPublicacionId!.toString(),
            foto,
          );
          fotosResultados.push({ status: "success", data: resultado });
        } catch (fotoError: any) {
          console.error(
            `Error subiendo foto ${foto.originalname}:`,
            fotoError.message,
          );
          fotosResultados.push({
            status: "error",
            filename: foto.originalname,
            message: fotoError.message,
          });
        }
      }
    }

    res.status(201).json({
      message: "Publicación creada",
      idPublicacion: createdPublicacionId,
      publicacion: createdPublicacion,
      propiedad: createdPropiedad,
      fotos: fotosResultados,
    });
  } catch (error: any) {
    // Rollback solo si falla la creación de la publicación o propiedad
    if (createdPropiedadId && !createdPublicacionId) {
      console.log("Error creando publicación, eliminando propiedad...");
      await propiedadService.eliminarPropiedad(createdPropiedadId.toString());
    }

    res.status(500).json({
      error: error.message || "Error en la creación de publicación con fotos",
    });
  }
};

export const getPublicationsByPropertyIds = async (
  req: Request,
  res: Response,
) => {
  let rawIds: any;

  if (req.method === "POST") {
    rawIds = Array.isArray(req.body)
      ? req.body
      : req.body?.ids || req.body?.propiedadIds;
  } else if (req.method === "GET") {
    rawIds = req.query.ids || req.query.propiedadIds;
  }

  let propertyIds: number[] = [];
  if (rawIds) {
    if (Array.isArray(rawIds)) {
      propertyIds = rawIds.map(Number);
    } else {
      propertyIds = String(rawIds)
        .split(",")
        .map((val) => Number(val.trim()));
    }
  }

  propertyIds = propertyIds.filter((id) => !isNaN(id) && id > 0);

  if (propertyIds.length === 0) {
    return res.status(400).json({
      error:
        "Debe proporcionar una lista válida de IDs de propiedad (ya sea vía Query o Body)",
    });
  }

  try {
    const publicaciones =
      await publicacionService.getPublicationsByPropertyIds(propertyIds);
    return res.json(publicaciones);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getPublicationsByCityId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const propertyIds = await propiedadService.getPropertiesByCityId(
      id as string,
    );
    if (!propertyIds || propertyIds.length === 0) {
      return res.json([]);
    }
    const publications =
      await publicacionService.getPublicationsByPropertyIds(propertyIds);
    res.json(publications);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
