import httpProxy from 'http-proxy'
import getConfig from 'next/config'

import type { NextApiRequest, NextApiResponse } from 'next'

const {
    serverRuntimeConfig: { proxyName },
} = getConfig()

const proxy = httpProxy.createProxy()

proxy.on('proxyReq', (proxyReq, req) => {
    proxyReq.setHeader('via', proxyName)
    
    // Извлекаем квери параметры из URL
    const queryParams = req.url?.split('?')[1]
    if (queryParams) {
        // Добавляем квери параметры к целевому запросу
        proxyReq.path += `?${queryParams}`
    }
})

proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err)
   
})

export const config = {
    api: {
        bodyParser: false,
    },
}

export default function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Извлекаем path из запроса
        const { path } = req.query

        // Проверяем, что path существует и не является массивом
        if (!path || Array.isArray(path)) {
            res.status(400).json({ error: 'Invalid path parameter' })
            return resolve()
        }

        // Формируем целевой URL для проксирования
        const targetUrl = `https://condo.d.doma.ai/api/files/ticket/${path}`

        console.log(`Proxying to: ${targetUrl}`)

        // Проксируем запрос
        proxy.web(req, res, {
            target: targetUrl,
            changeOrigin: true,
            ignorePath: true, // Игнорируем путь, так как мы добавляем его вручную в onProxyReq
        }, (err) => {
            if (err) {
                console.error('Error during proxying:', err)
                res.status(500).json({ error: 'Failed to proxy request' })
                return reject(err)
            }
            console.log('Proxy request completed successfully')
            resolve()
        })
    })
}
