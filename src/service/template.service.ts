import { template } from '@prisma/client';
import { ITemplateRepository } from '../repository/interface/iTemplate.repository';
import { TemplateRepository } from '../repository/template.repository';
import { NotFoundError } from '../handleResponse/error.response';
import { ITemplateService } from './interface/iTemplate.service';
export class TemplateService implements ITemplateService {
  private static Instance: TemplateService;
  public static getInstance(): ITemplateService {
    if (!this.Instance) {
      this.Instance = new TemplateService();
    }
    return this.Instance;
  }
  private static readonly _templateRepository: ITemplateRepository =
    TemplateRepository.getInstance();
  constructor() {}

  public async getTemplate({
    name,
  }: {
    name: string;
  }): Promise<template | null> {
    const foundTemp = await TemplateService._templateRepository.getTemplate({
      temName: name,
    });

    return foundTemp;
  }
}
