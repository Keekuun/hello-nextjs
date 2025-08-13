import {useEffect, useState} from 'react'
import {arrayBufferToBlob, arrayBufferToBlobUrl, blobToUrl} from "@/app/utils/file";

interface UseAudioLoaderProps {
  src: string
  start: number
  end: number
}

interface UseAudioLoaderReturn {
  loading: boolean
  error?: Error
  data?: string
  blob?: Blob
}

export const useAudioLoader = ({
                                 src,
                                 start,
                                 end,
                               }: UseAudioLoaderProps): UseAudioLoaderReturn => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()
  const [data, setData] = useState<string | undefined>()
  const [blob, setBlob] = useState<Blob | undefined>()

  useEffect(() => {
    let isMounted = true

    const fetchAudio = async () => {
      if (!src || start < 0 || end <= start) {
        setError(new Error('Invalid audio source or range'))
        return
      }

      setLoading(true)
      try {
        const response = await fetch(src, {
          headers: {
            Range: `bytes=${start}-${end}`,
          },
        })

        if (!response.ok && response.status !== 206) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const buffer = await response.arrayBuffer()

        if (isMounted) {
          const blob = arrayBufferToBlob(buffer, 'audio/mpeg')
          setBlob(blob)
          setData(blobToUrl(blob))
          setError(undefined)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchAudio()

    return () => {
      isMounted = false
    }
  }, [src, start, end])

  return {loading, error, data, blob}
}
