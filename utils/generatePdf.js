import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Asset } from "expo-asset";
import { Buffer } from "buffer";
import { captureRef } from "react-native-view-shot";
import React, { useRef } from "react";
import { View } from "react-native";

const generatePdf = async (data, qrCodeRef) => {
  try {
    // Capture QR code as base64 image
    const qrCodeUri = await captureRef(qrCodeRef, {
      format: "png",
      quality: 1.0,
      result: "base64",
    });
    const qrImageBytes = Buffer.from(qrCodeUri, "base64");
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    // Load the template PDF
    const templateUri = FileSystem.documentDirectory + "template.pdf";
    const templateExists = await FileSystem.getInfoAsync(templateUri);

    if (!templateExists.exists) {
      const templateAsset = Asset.fromModule(require("../assets/template.pdf"));
      await templateAsset.downloadAsync();
      await FileSystem.copyAsync({
        from: templateAsset.localUri,
        to: templateUri,
      });
    }

    const templateBytes = await FileSystem.readAsStringAsync(templateUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create a PDFDocument from the template
    const pdfDoc = await PDFDocument.load(Buffer.from(templateBytes, "base64"));
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Embed the QR code image
    const qrImageEmbed = await pdfDoc.embedPng(qrImageBytes);
    firstPage.drawImage(qrImageEmbed, {
      x: 45,
      y: height - 205,
      width: 90,
      height: 90,
    });
    const texts = [
      { text: `${data.id_res}`, x: 315, y: height - 65 }, // Reservation ID
      {
        text: `${new Date(data.created_at).toLocaleDateString()}`,
        x: 455,
        y: height - 65,
      }, // Creation Date
      { text: `${data.created_by}`, x: 528, y: height - 65 }, // Created By
      { text: `${data.id_departure}`, x: 90, y: height - 96 }, // Departure ID
      {
        text: `${capitalizeFirstLetter(data.name)} ${capitalizeFirstLetter(
          data.lastname
        )}`,
        x: 230,
        y: height - 96,
      }, // Full Name
      { text: `${data.departure_date}`, x: 455, y: height - 96 }, // Departure Date
      { text: `${data.departure_time}`, x: 527, y: height - 96 }, // Departure Time
      {
        text: `${capitalizeFirstLetter(data.from_city)}`,
        x: 230,
        y: height - 145,
      }, // From City
      {
        text: `${capitalizeFirstLetter(data.to_city)}`,
        x: 320,
        y: height - 190,
      }, // To City
      // { text: `${data.telephone}`, x: 160, y: height - 47 }, // Telephone
      {
        text: `${new Date(
          new Date(data.departure_date).setMonth(
            new Date(data.departure_date).getMonth() + 6
          )
        ).toLocaleDateString()}`,
        x: 484,
        y: height - 182,
      }, // Valid Until Date
      { text: `${data.rsd_price} RSD`, x: 440, y: height - 204 }, // RSD Price
      {
        text: `${(data.rsd_price / 117.5).toFixed(2)} EUR`,
        x: 520,
        y: height - 204,
      }, // EUR Price
    ];

    // Add text to specific coordinates, centered at coordinates
    texts.forEach(({ text, x, y }) => {
      const textWidth = font.widthOfTextAtSize(text, 12);
      firstPage.drawText(text, {
        x: x - textWidth / 2,
        y,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
    });

    // Save the PDF document
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
    const pdfPath = FileSystem.documentDirectory + "generated.pdf";
    await FileSystem.writeAsStringAsync(pdfPath, pdfBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share or open the PDF file
    await Sharing.shareAsync(pdfPath);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

export default generatePdf;
