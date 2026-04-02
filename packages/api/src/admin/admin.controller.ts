import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── All Master Data ─────────────────────────────────────────────────────────

  @Get('master-data')
  getAllMasterData() {
    return this.adminService.getAllMasterData();
  }

  // ─── Change Logs ──────────────────────────────────────────────────────────────

  @Get('logs')
  getLogs(@Query() query: any) {
    return this.adminService.getLogs(query);
  }

  // ─── Vehicle Statuses ─────────────────────────────────────────────────────────

  @Get('statuses')
  getStatuses() {
    return this.adminService.getStatuses();
  }

  @Post('statuses')
  @Roles('admin')
  createStatus(@Body() body: any) {
    return this.adminService.createStatus(body);
  }

  @Patch('statuses/:id')
  @Roles('admin')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateStatus(id, body);
  }

  @Delete('statuses/:id')
  @Roles('admin')
  deleteStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteStatus(id);
  }

  // ─── Brands ───────────────────────────────────────────────────────────────────

  @Get('brands')
  getBrands() {
    return this.adminService.getBrands();
  }

  @Post('brands')
  @Roles('admin')
  createBrand(@Body() body: any) {
    return this.adminService.createBrand(body);
  }

  @Patch('brands/:id')
  @Roles('admin')
  updateBrand(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateBrand(id, body);
  }

  @Delete('brands/:id')
  @Roles('admin')
  deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteBrand(id);
  }

  // ─── Models ───────────────────────────────────────────────────────────────────

  @Get('models')
  getModels(@Query('brand_id') brandId: string) {
    return this.adminService.getModels(brandId ? Number(brandId) : undefined);
  }

  @Post('models')
  @Roles('admin')
  createModel(@Body() body: any) {
    return this.adminService.createModel(body);
  }

  @Patch('models/:id')
  @Roles('admin')
  updateModel(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateModel(id, body);
  }

  @Delete('models/:id')
  @Roles('admin')
  deleteModel(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteModel(id);
  }

  // ─── Document Types ───────────────────────────────────────────────────────────

  @Get('document-types')
  getDocumentTypes() {
    return this.adminService.getDocumentTypes();
  }

  @Post('document-types')
  @Roles('admin')
  createDocumentType(@Body() body: any) {
    return this.adminService.createDocumentType(body);
  }

  @Patch('document-types/:id')
  @Roles('admin')
  updateDocumentType(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateDocumentType(id, body);
  }

  @Delete('document-types/:id')
  @Roles('admin')
  deleteDocumentType(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteDocumentType(id);
  }

  // ─── Insurance Companies ──────────────────────────────────────────────────────

  @Get('insurance-companies')
  getInsuranceCompanies() {
    return this.adminService.getInsuranceCompanies();
  }

  @Post('insurance-companies')
  @Roles('admin')
  createInsuranceCompany(@Body() body: any) {
    return this.adminService.createInsuranceCompany(body);
  }

  @Patch('insurance-companies/:id')
  @Roles('admin')
  updateInsuranceCompany(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateInsuranceCompany(id, body);
  }

  @Delete('insurance-companies/:id')
  @Roles('admin')
  deleteInsuranceCompany(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteInsuranceCompany(id);
  }

  // ─── Procurement Types ────────────────────────────────────────────────────────

  @Get('procurement-types')
  getProcurementTypes() {
    return this.adminService.getProcurementTypes();
  }

  @Post('procurement-types')
  @Roles('admin')
  createProcurementType(@Body() body: any) {
    return this.adminService.createProcurementType(body);
  }

  @Patch('procurement-types/:id')
  @Roles('admin')
  updateProcurementType(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateProcurementType(id, body);
  }

  @Delete('procurement-types/:id')
  @Roles('admin')
  deleteProcurementType(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProcurementType(id);
  }

  // ─── Offense Types ────────────────────────────────────────────────────────────

  @Get('offense-types')
  getOffenseTypes() {
    return this.adminService.getOffenseTypes();
  }

  @Post('offense-types')
  @Roles('admin')
  createOffenseType(@Body() body: any) {
    return this.adminService.createOffenseType(body);
  }

  @Patch('offense-types/:id')
  @Roles('admin')
  updateOffenseType(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateOffenseType(id, body);
  }

  @Delete('offense-types/:id')
  @Roles('admin')
  deleteOffenseType(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteOffenseType(id);
  }

  // ─── Offense Authorities ──────────────────────────────────────────────────────

  @Get('offense-authorities')
  getOffenseAuthorities() {
    return this.adminService.getOffenseAuthorities();
  }

  @Post('offense-authorities')
  @Roles('admin')
  createOffenseAuthority(@Body() body: any) {
    return this.adminService.createOffenseAuthority(body);
  }

  @Patch('offense-authorities/:id')
  @Roles('admin')
  updateOffenseAuthority(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateOffenseAuthority(id, body);
  }

  @Delete('offense-authorities/:id')
  @Roles('admin')
  deleteOffenseAuthority(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteOffenseAuthority(id);
  }

  // ─── Fault Types ──────────────────────────────────────────────────────────────

  @Get('fault-types')
  getFaultTypes() {
    return this.adminService.getFaultTypes();
  }

  @Post('fault-types')
  @Roles('admin')
  createFaultType(@Body() body: any) {
    return this.adminService.createFaultType(body);
  }

  @Patch('fault-types/:id')
  @Roles('admin')
  updateFaultType(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateFaultType(id, body);
  }

  @Delete('fault-types/:id')
  @Roles('admin')
  deleteFaultType(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteFaultType(id);
  }

  // ─── Accident Processing Statuses ─────────────────────────────────────────────

  @Get('accident-processing-statuses')
  getAccidentProcessingStatuses() {
    return this.adminService.getAccidentProcessingStatuses();
  }

  @Post('accident-processing-statuses')
  @Roles('admin')
  createAccidentProcessingStatus(@Body() body: any) {
    return this.adminService.createAccidentProcessingStatus(body);
  }

  @Patch('accident-processing-statuses/:id')
  @Roles('admin')
  updateAccidentProcessingStatus(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateAccidentProcessingStatus(id, body);
  }

  @Delete('accident-processing-statuses/:id')
  @Roles('admin')
  deleteAccidentProcessingStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAccidentProcessingStatus(id);
  }

  // ─── Absence Types ────────────────────────────────────────────────────────────

  @Get('absence-types')
  getAbsenceTypes() {
    return this.adminService.getAbsenceTypes();
  }

  @Post('absence-types')
  @Roles('admin')
  createAbsenceType(@Body() body: any) {
    return this.adminService.createAbsenceType(body);
  }

  @Patch('absence-types/:id')
  @Roles('admin')
  updateAbsenceType(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateAbsenceType(id, body);
  }

  @Delete('absence-types/:id')
  @Roles('admin')
  deleteAbsenceType(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAbsenceType(id);
  }

  // ─── Companies ────────────────────────────────────────────────────────────────

  @Get('companies')
  getCompanies() {
    return this.adminService.getCompanies();
  }

  @Post('companies')
  @Roles('admin')
  createCompany(@Body() body: any) {
    return this.adminService.createCompany(body);
  }

  @Patch('companies/:id')
  @Roles('admin')
  updateCompany(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateCompany(id, body);
  }

  @Delete('companies/:id')
  @Roles('admin')
  deleteCompany(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCompany(id);
  }

  // ─── Stations ─────────────────────────────────────────────────────────────────

  @Get('stations')
  getStations(@Query() query: any) {
    return this.adminService.getStations(query);
  }

  @Post('stations')
  @Roles('admin')
  createStation(@Body() body: any) {
    return this.adminService.createStation(body);
  }

  @Patch('stations/:id')
  @Roles('admin')
  updateStation(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateStation(id, body);
  }

  @Delete('stations/:id')
  @Roles('admin')
  deleteStation(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteStation(id);
  }

  // ─── Employees ────────────────────────────────────────────────────────────────

  @Get('employees')
  getEmployees(@Query() query: any) {
    return this.adminService.getEmployees(query);
  }

  @Post('employees')
  @Roles('admin', 'dispatcher')
  createEmployee(@Body() body: any) {
    return this.adminService.createEmployee(body);
  }

  @Patch('employees/:id')
  @Roles('admin', 'dispatcher')
  updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateEmployee(id, body);
  }

  @Delete('employees/:id')
  @Roles('admin')
  deleteEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteEmployee(id);
  }

  // ─── Users ────────────────────────────────────────────────────────────────────

  @Get('users')
  @Roles('admin')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Post('users')
  @Roles('admin')
  createUser(@Body() body: any) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id')
  @Roles('admin')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id')
  @Roles('admin')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }
}
