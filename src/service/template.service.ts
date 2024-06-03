import { template } from '@prisma/client';
import { ITemplateRepository } from '../repository/iTemplate.repository';
import { TemplateRepostory } from '../repository/template.repository';
import { NotFoundError } from '../handleResponse/error.response';
import { ITemplateService } from './iTemplate.service';
export class TemplateService implements ITemplateService {
  private readonly _templateRepository: ITemplateRepository;
  constructor() {
    this._templateRepository = TemplateRepostory.getInstance();
  }

  public async getTemplate({
    name,
  }: {
    name: string;
  }): Promise<template | null> {
    const foundTemp = await this._templateRepository.getTemplate({
      temName: name,
    });

    return foundTemp;
  }
}
