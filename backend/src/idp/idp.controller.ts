import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { IdpService } from './idp.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('idp')
export class IdpController {
  constructor(private readonly idpService: IdpService) {}

  // ── Employee submission ─────────────────────────────────────────────────

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.idpService.create({
      ...body,
      userId: req.user?.id ?? body.userId,
    });
  }

  // ── HR dashboard ────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'hr-staff')
  @Get()
  findAll() {
    return this.idpService.findAll();
  }

  // ── Suggestions (HEI / Pro-ACT) — static segments before :refId ────────

  @Get('suggestions/:type')
  getSuggestions(@Param('type') type: string) {
    return this.idpService.getSuggestions(type);
  }

  @Post('suggestions/:type')
  saveSuggestion(@Param('type') type: string, @Body() body: { value: string }) {
    const allowed = ['hei', 'proact'];
    if (!allowed.includes(type)) return;
    return this.idpService.saveSuggestion(type, body.value);
  }

  // ── Supervisor token routes — static segments before :refId ────────────

  @Get('by-token/:token')
  findByToken(@Param('token') token: string) {
    return this.idpService.findByToken(token);
  }

  @Post('by-token/:token/supervisor')
  updateSupervisorByToken(@Param('token') token: string, @Body() body: any) {
    return this.idpService.updateSupervisorByToken(token, body);
  }

  // ── Dynamic :refId routes ───────────────────────────────────────────────

  @Get(':refId/pdf')
  async downloadPdf(@Param('refId') refId: string, @Res() res: Response) {
    const buffer = await this.idpService.generatePdf(refId);
    if (!buffer) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="IDP_${refId}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':refId/edit-check')
  async editCheck(
    @Param('refId') refId: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    if (!email) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Email is required.' });
      return;
    }
    const result = await this.idpService.getForEdit(refId, email);
    if (result === 'not_found') {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No IDP found with that Reference ID.' });
      return;
    }
    if (result === 'wrong_email') {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Email does not match this IDP record.' });
      return;
    }
    if (result === 'locked') {
      res.status(HttpStatus.FORBIDDEN).json({
        message:
          'This IDP has already been reviewed by your supervisor and can no longer be edited.',
      });
      return;
    }
    res.status(HttpStatus.OK).json(result);
  }

  @Patch(':refId')
  @HttpCode(HttpStatus.OK)
  async updateByEmployee(
    @Param('refId') refId: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    if (!body.email) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Email is required.' });
      return;
    }
    const result = await this.idpService.updateByEmployee(
      refId,
      body.email,
      body,
    );
    if (result === 'not_found') {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No IDP found with that Reference ID.' });
      return;
    }
    if (result === 'wrong_email') {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Email does not match this IDP record.' });
      return;
    }
    if (result === 'locked') {
      res.status(HttpStatus.FORBIDDEN).json({
        message:
          'This IDP has already been reviewed and can no longer be edited.',
      });
      return;
    }
    res.status(HttpStatus.OK).json(result);
  }

  @Get(':refId')
  findOne(@Param('refId') refId: string) {
    return this.idpService.findByRef(refId);
  }

  @Post(':refId/supervisor')
  updateSupervisor(@Param('refId') refId: string, @Body() body: any) {
    return this.idpService.updateSupervisor(refId, body);
  }
}