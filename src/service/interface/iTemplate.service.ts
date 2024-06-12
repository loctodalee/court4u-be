import { template } from "@prisma/client";

export interface ITemplateService {
  getTemplate({ name }: { name: string }): Promise<template | null>;
}
