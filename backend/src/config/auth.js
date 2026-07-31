export const roles = ['Administrador', 'Gestor', 'Colaborador', 'Auditor'];

export function jwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET deve ser configurado para iniciar a API.');
  }
  return process.env.JWT_SECRET;
}
