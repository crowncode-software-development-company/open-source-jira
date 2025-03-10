import httpProxy from 'http-proxy'
import getConfig from 'next/config'

import type { NextApiRequest, NextApiResponse } from 'next'

const {
    publicRuntimeConfig: { serverUrl },
    serverRuntimeConfig: { proxyName },
} = getConfig()

const proxy = httpProxy.createProxy()

proxy.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.setHeader('via', proxyName)
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
        proxy.web(req, res, {
            target: 'https://condo.d.doma.ai/admin/api',
            changeOrigin: true,
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