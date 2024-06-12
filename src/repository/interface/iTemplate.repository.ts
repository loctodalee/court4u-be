import { template } from "@prisma/client";

export interface ITemplateRepository {
  getTemplate({ temName }: { temName: string }): Promise<template | null>;
}
