import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";

const fillPdf = async (ticketData) => {
  try {
    // PDF šablon iz assets foldera
    const asset = Asset.fromModule(require("./assets/template.pdf"));
    await asset.downloadAsync();
    const pdfPath = asset.localUri;

    const pdfBytes = await FileSystem.readAsStringAsync(pdfPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const {
      id_res,
      created_at,
      created_by,
      id_line,
      name,
      lastname,
      birth_date,
      discount,
      departure_date,
      departure_time,
      from_city,
      to_city,
      pass_comment,
      valid_until,
      rsd_price,
    } = ticketData;

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    firstPage.drawText(id_res, {
      x: 105,
      y: 700,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(created_at, {
      x: 147,
      y: 700,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(created_by, {
      x: 181,
      y: 700,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(id_line, {
      x: 27,
      y: 670,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`${name} ${lastname}`, {
      x: 70,
      y: 670,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(birth_date, {
      x: 112,
      y: 670,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`${discount}%`, {
      x: 125,
      y: 650,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(departure_date, {
      x: 147,
      y: 670,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(departure_time, {
      x: 176,
      y: 670,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(from_city, {
      x: 55,
      y: 650,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(to_city, {
      x: 95,
      y: 630,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(pass_comment || "/", {
      x: 150,
      y: 650,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(valid_until, {
      x: 160,
      y: 630,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`${rsd_price} RSD`, {
      x: 143,
      y: 610,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`${(rsd_price / 118).toFixed(2)} EUR`, {
      x: 174,
      y: 610,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    const pdfOutputBytes = await pdfDoc.save();
    const outputPath = `${FileSystem.documentDirectory}filled-ticket.pdf`;
    await FileSystem.writeAsStringAsync(outputPath, pdfOutputBytes, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("PDF uspešno sačuvan na: ", outputPath);

    await Sharing.shareAsync(outputPath);
  } catch (error) {
    console.error("Greška pri popunjavanju PDF-a:", error);
  }
};

export default fillPdf;
