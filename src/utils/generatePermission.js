export const generatePermissions = (roles) => {
  const ALL_SYS_PERMISSIONS = roles.map((role) => [...role.securityUserPermissions, ...role.securityUserPermissionChecks]).flat()
  const PERMISSIONS = generate(ALL_SYS_PERMISSIONS).flat()
  console.log(PERMISSIONS)
  return PERMISSIONS
}

const generate = (data, parentName = null) => {
  return data.reduce((prev, curr) => {
    const SPLITTER = '_'
    const NAME = `${parentName ? parentName + SPLITTER : ''}${kebabCase(curr.defaultName)}`
    prev.push(NAME)
    if (curr.children) {
      const CHILDREN = generate(curr.children, NAME)
      prev.push([...CHILDREN])
    }
    return prev.flat()
  }, [])
}

const kebabCase = (string) =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/\//g, '-')
    .toLowerCase()
