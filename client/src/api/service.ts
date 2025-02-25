import {
  useMutation,
    useQuery,
  } from '@tanstack/react-query'
  
export const useCreateSampleTemplate = (folderName: string, fileName: string) => useQuery({
    queryKey: ['repoData', folderName, fileName],
    queryFn: () =>
      fetch(`http://localhost:8080/r2/downloadTemplate?folderName=${folderName}&fileName=${fileName}`).then((res) =>
        res.json(),
      ),
      retry: false
  })

  export const useFileTree = () => useMutation({
    mutationKey: ["useFile"],
    mutationFn: async (path: string) =>
      await fetch(`http://localhost:8080/files?path=${path}`).then(async (res) =>
        await res.json(),
      ),
      retry: false
  }) 

  export const useFile = () => useMutation({
    mutationKey: ["useFile"],
    mutationFn: async (path: string) =>
      await fetch(`http://localhost:8080/file?path=${path}`).then(async (res) =>
        await res.blob(),
      ),
      retry: false
  }) 

  export const useSaveFile = (file: string, path: string) => useMutation({
    mutationKey: ["useSaveFile"],
    mutationFn: async () =>
      await fetch(`http://localhost:8080/file?path=${path}`,
      {
        method: "POST",
        
        body: file,
      }
    )
      .then(async (res) =>
        await res.json(),
      ),
      retry: false
  })