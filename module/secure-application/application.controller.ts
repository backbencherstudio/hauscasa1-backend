import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getImageUrl } from "../../utils/base_utl";
import { generateReferenceCode } from "../../utils/generateReferenceCode";
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export const createApplication = async (req: Request, res: Response) => {
  try {
    const { descriptions } = req.body;
    const file = req.file?.filename ?? null;

    const referenceCode = await generateReferenceCode();

    const post = await prisma.post.create({
      data: {
        referenceCode,
        file,
        descriptions,
      },
    });

    const responseData = {
      ...post,
      file: file ? getImageUrl(`/uploads/${file}`) : null,
    };
    const qrCodeDataURL = await QRCode.toDataURL(post?.referenceCode);

    res.status(201).json({
      success: true,
      data: responseData,
      qrCodeDataURL,
    });
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const responseData = posts.map((post) => ({
      ...post,
      file: post.file ? getImageUrl(`/uploads/${post.file}`) : null,
    }));

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get All Applications Error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getApplicationByReference = async (
  req: Request,
  res: Response
) => {
  try {
    const { referenceCode } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        referenceCode,
      },
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    const qrCodeDataURL = await QRCode.toDataURL(referenceCode);

    const responseData = {
      ...post,
      file: post.file ? getImageUrl(`/uploads/${post.file}`) : null,
    };

    res.status(200).json({
      success: true,
      data: responseData,
      qrCode: qrCodeDataURL,
    });
  } catch (error) {
    console.error("Get Application By Reference Error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { referenceCode } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        referenceCode,
      },
    });

    if (!post) {
       res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return
    }

    await prisma.post.delete({
      where: {
        referenceCode,
      },
    });

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
