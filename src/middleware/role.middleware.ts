import { AccessControl } from 'accesscontrol';

let grantList = [
  { role: 'admin', resource: 'role', action: 'read:any', attributes: '*' },
  { role: 'owner', resource: 'role', action: 'read:own', attributes: '*' },
  { role: 'owner', resource: 'role', action: 'read:own', attributes: '*' },
];
const ac = new AccessControl(grantList);
export default ac;
