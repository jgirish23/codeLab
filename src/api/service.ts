import {
  useMutation,
    useQuery,
  } from '@tanstack/react-query'

export const useStartContainer = (projectId: string) => useQuery({
  queryKey: ['startContainer'],
  queryFn: () =>
      fetch(`http://localhost:8082/start?id=${projectId}&language=py`).then((res) =>
          res.json(),
      ),
  retry: false,
  refetchOnWindowFocus: false
})

export const useCreateSampleTemplate = (folderName: string,projectId: string, projectType: string) => useQuery({
    queryKey: ['repoData', folderName, projectType],
    queryFn: () =>
      fetch(`http://${projectId}.mylocal:8081/r2/downloadTemplate?folderName=${folderName}&projectType=${projectType}&projectId=${projectId}`).then((res) =>
        res.text(),
      ),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: false
  })

  export const useFileTree = () => useMutation({
    mutationKey: ["useFiles"],
    mutationFn: async (path: string) => {
        const projectId = localStorage.getItem('projectId')
        return await fetch(`http://${projectId}.mylocal:8081/files?path=${path}`).then(async (res) =>
            await res.json(),
        )
    },
      retry: false
  }) 

  export const useFile = () => useMutation({
    mutationKey: ["useFile"],
    mutationFn: async (path: string) => {
        const projectId = localStorage.getItem('projectId')
        return await fetch(`http://${projectId}.mylocal:8081/file?path=${path}`).then(async (res) =>
            await res.blob(),
        )
    },
      retry: false
  }) 

  export const useSaveFile = (file: string, path: string) => useMutation({
    mutationKey: ["useSaveFile"],
    mutationFn: async () => {
        const projectId = localStorage.getItem('projectId')
        return await fetch(`http://${projectId}.mylocal:8081/file?path=${path}`,
            {
                method: "POST",
                body: file,
            }
        )
            .then(async (res) =>
                await res.text(),
            )
    },
      retry: false
  })

export const useRunFile = () => useMutation({
    mutationKey: ["useRunFile"],
    mutationFn: async (command: string) => {
        const projectId = localStorage.getItem('projectId')
        return await fetch(`http://${projectId}.mylocal:8081/runFile`,
            {
                method: "POST",
                body: command,
            }
        )
            .then(async (res) =>
                await res.text(),
            )
    },
    retry: false
})