import express from 'express';
import upload from '../../config/multer.config';
import { createApplication, getAllApplications, getApplicationByReference, deleteApplication } from './application.controller';
const router = express.Router();


router.post('/', upload.single('file'), createApplication);
router.get('/', getAllApplications);
router.get('/:referenceCode', getApplicationByReference);
router.delete('/:referenceCode', deleteApplication);

export default router;
