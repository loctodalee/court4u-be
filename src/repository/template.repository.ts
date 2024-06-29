import { template } from '@prisma/client';
import { ITemplateRepository } from './interface/iTemplate.repository';
import prisma from '../lib/prisma';

export class TemplateRepository implements ITemplateRepository {
  private static Instance: TemplateRepository;
  public static getInstance(): ITemplateRepository {
    if (!TemplateRepository.Instance) {
      TemplateRepository.Instance = new TemplateRepository();
    }
    return TemplateRepository.Instance;
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
