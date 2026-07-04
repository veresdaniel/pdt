/** PM2 — one-time on server: pm2 start deploy/ecosystem.config.js && pm2 save */
module.exports = {
	apps: [
		{
			name: 'pdt-dev',
			cwd: '/var/www/dev.productdesigntalks.eu',
			script: '/var/www/dev.productdesigntalks.eu/build/index.js',
			exec_mode: 'fork',
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '512M',
			merge_logs: true,
			time: true,
			out_file: '/var/log/pm2/pdt-dev-out.log',
			error_file: '/var/log/pm2/pdt-dev-error.log',
			env: {
				PORT: 3002,
				HOST: '127.0.0.1',
				NODE_ENV: 'production',
				ORIGIN: 'https://dev.productdesigntalks.eu',
				PROTOCOL_HEADER: 'x-forwarded-proto',
				HOST_HEADER: 'x-forwarded-host'
			}
		}
	]
};
