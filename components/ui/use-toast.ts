export const useToast = () => ({
  toast: ({ title, description, variant }: any) => {
    console.log('[Toast]', title, description)
  }
})

