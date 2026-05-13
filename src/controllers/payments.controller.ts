import { Request, Response } from "express";
import paymentService from "../services/payments.services";
import publicacionService from "../services/Publicacion.service";
import propiedadService from "../services/propiedad.service";

export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.getPaymentById(id as string);
    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  const { idPublicacion, idUsuario } = req.body;

  try {
    console.log("Iniciando procesamiento de pago...");
    const paymentResult = await paymentService.pay(req.body);

    if (paymentResult.estado === "APROBADO") {
      console.log(
        "Pago APROBADO. Orquestando actualizaciones de propiedad y publicación...",
      );

      try {
        const publicacion = await publicacionService.getPublicacionByid(
          idPublicacion.toString(),
        );

        if (publicacion) {
          if (publicacion.propiedadId) {
            await propiedadService.actualizarPropiedad(
              publicacion.propiedadId.toString(),
              {
                estadoPropiedad: 2,
                idCliente: idUsuario,
              } as any,
            );
            console.log(
              `Propiedad ${publicacion.propiedadId} actualizada: Vendida a Cliente ${idUsuario}.`,
            );
          }

          await publicacionService.updatePublicacion(idPublicacion.toString(), {
            titulo: publicacion.titulo,
            descripcion: publicacion.descripcion,
            precio: publicacion.precio,
            ubicacion: publicacion.ubicacion,
            vendedorId: publicacion.vendedorId,
            tipoVentas: publicacion.tipoVentas,
            propiedadId: publicacion.propiedadId,
            estado: "vendido",
          } as any);
          console.log(`Publicación ${idPublicacion} marcada como Vendida.`);
        }
      } catch (updateError: any) {
        console.error(
          "Error en la orquestación post-pago:",
          updateError.message,
        );
      }
    } else {
      console.log(`Pago rechazado: ${paymentResult.mensaje}`);
    }
    res
      .status(paymentResult.estado === "APROBADO" ? 201 : 402)
      .json(paymentResult);
  } catch (error: any) {
    console.error("Error en orquestador de pagos:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Error interno al procesar el pago" });
  }
};
