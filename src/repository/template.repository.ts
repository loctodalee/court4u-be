import { template } from "@prisma/client";
import { ITemplateRepository } from "./iTemplate.repository";
import prisma from "../lib/prisma";

export class TemplateRepostory implements ITemplateRepository {
  private static Instance: TemplateRepostory;
  public static getInstance(): TemplateRepostory {
    if (!TemplateRepostory.Instance) {
      TemplateRepostory.Instance = new TemplateRepostory();
    }
    return TemplateRepostory.Instance;
  }
  async getTemplate({
    temName,
  }: {
    temName: string;
  }): Promise<template | null> {
    const foundTemp = await prisma.template.findFirst({
      where: {
        name: temName,
      },
    });
    return foundTemp ? foundTemp : null;
  }
}
