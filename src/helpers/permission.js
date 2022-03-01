
/**
 *
 * @param {*} userPermissions permissions of current user
 * @param {*} current current name of permission define in sidebar
 */
export function checkPermission(userPermissions, current) {
    if(!userPermissions) return false;

    if(userPermissions.indexOf(current) >= 0) return true;
    else return false;
}