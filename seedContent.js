import mongoose from "mongoose";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import Content from "./models/Content.js";

dotenv.config();

const seed = async () => {
  await conectarDB();

  await Content.deleteMany();

  await Content.insertMany([
    {
      title: "HTML5 para profesionales",
      description: "La base de toda página web...",
      videoUrl: "http://localhost:5173/videos/html5-intro.mp4",
      pdfUrl: "http://localhost:5173/pdfs/HTML5-para-Juniors.pdf",
      docLink: "https://developer.mozilla.org/es/docs/Web/HTML",
      tags: [
        { label: "HTML5", variant: "bg-danger" },
        { label: "Fundamentos", variant: "bg-secondary" }
      ],
      track: "fundamentos",
      accessLevel: "free",
      order: 1
    },
    {
      title: "CSS: diseño y estilo profesional",
      description: "Cómo dar estilo a la web...",
      videoUrl: "http://localhost:5173/videos/css-intro.mp4",
      pdfUrl: "http://localhost:5173/pdfs/CSS-para-juniors.pdf",
      docLink: "https://developer.mozilla.org/es/docs/Web/CSS",
      tags: [
        { label: "CSS", variant: "bg-info" },
        { label: "Diseño", variant: "bg-secondary" }
      ],
      track: "fundamentos",
      accessLevel: "free",
      order: 2
    }
  ]);

  console.log("Contenido cargado 🚀");
  process.exit();
};

seed();