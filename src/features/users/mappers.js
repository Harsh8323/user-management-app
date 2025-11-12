export const mapApiUserToModel = (user) => ({
  id: Number(user?.id),
  name: user?.name?.trim() ?? '',
  email: user?.email?.trim() ?? '',
  phone: user?.phone?.trim() ?? '',
})

export const mapFormToApi = (form) => ({
  name: form.name?.trim() ?? '',
  email: form.email?.trim() ?? '',
  phone: form.phone?.trim() ?? '',
})

