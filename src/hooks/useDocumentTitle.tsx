import { useEffect } from 'react'

// 修改 document.title
function useDocumentTitle(newTitle: string) {
  useEffect(() => {
    document.title = `[虾]${newTitle}`

    return () => {
      document.title = '虾虾郑的个人网站'
    }
  }, [newTitle])
}

export default useDocumentTitle