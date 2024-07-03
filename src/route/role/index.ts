import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { RoleController } from '../../controller/role.controller';
import { grantAccess } from '../../middleware/rbac';

const router = express.Router();
// router.use(authentication);
// router.use(CheckApiKey);
router.post('/', asyncHandler(RoleController.getInstance().addRole));
router.get(
  '/name/:name',
  asyncHandler(RoleController.getInstance().findByName)
);
router.get(
  '/userRole',
  asyncHandler(RoleController.getInstance().getAllUserRole)
);
router.get(
  '/userRole/:userId/:roleId',
  asyncHandler(RoleController.getInstance().findUserRole)
);
router.get('/:id', asyncHandler(RoleController.getInstance().findRoleById));
router.get(
  '/',
  grantAccess('readAny', 'role'),
  asyncHandler(RoleController.getInstance().getAllRole)
);

module.exports = router;
