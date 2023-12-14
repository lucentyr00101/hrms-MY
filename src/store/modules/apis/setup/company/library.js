import { list, add, update, deleteData, download, search } from '@/api/setup/company/library'

const downloadFromBlob = (blob, filename) => {
  const blobData = new Blob([blob], { type: 'application/octet-stream' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blobData)
  link.download = filename
  link.click()
}

export default {
  namespaced: true,
  actions: {
    async list(_, queryParameters = {}) {
      try {
        return await list(queryParameters)
      } catch (e) {
        throw e
      }
    },
    async search(_, params = {}) {
      try {
        return await search(params)
      } catch (error) {
        throw error
      }
    },
    async add(_, payload) {
      try {
        return await add(payload)
      } catch (e) {
        throw e
      }
    },
    async download(_, payload) {
      try {
        const res = await download(payload)
        downloadFromBlob(res, `${payload.title}_attachments.zip`)
        return res
      } catch (e) {
        throw e
      }
    },
    async update(_, payload) {
      try {
        return await update(payload)
      } catch (e) {
        throw e
      }
    },
    async delete(_, payload) {
      try {
        return await deleteData(payload)
      } catch (e) {
        throw e
      }
    }
  }
}
