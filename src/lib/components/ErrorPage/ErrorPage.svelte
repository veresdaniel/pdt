<script lang="ts">
	let {
		status,
		title,
		message,
		homeHref,
		homeLabel,
		embedded = false
	}: {
		status: number;
		title: string;
		message: string;
		homeHref: string;
		homeLabel: string;
		embedded?: boolean;
	} = $props();
</script>

<section class="error-hero" class:embedded>
	<div class="error-card">
		<div class="error-code">{status}</div>
		<h1 class="error-title">{title}</h1>
		<p class="error-message">{message}</p>
		<div class="error-actions">
			<a class="btn-primary" href={homeHref}>{homeLabel}</a>
		</div>
	</div>
</section>

<style lang="scss">
	.error-hero {
		min-height: min(100vh, 100dvh);
		background: linear-gradient(135deg, var(--color-primary-600, #ef562f) 0%, #ff9478 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 20px;
	}

	.error-hero.embedded {
		min-height: auto;
		padding: 64px 20px;
	}

	.error-card {
		background: #fff;
		padding: 70px 60px;
		border-radius: 16px;
		text-align: center;
		max-width: 600px;
		width: 100%;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
	}

	.error-code {
		font-size: 72px;
		font-weight: 800;
		color: var(--color-primary-600, #ef562f);
		margin-bottom: 10px;
		letter-spacing: 2px;
		line-height: 1;
	}

	.error-title {
		font-size: 32px;
		margin-bottom: 20px;
		color: #1a1a1a;
		font-weight: 700;
		line-height: 1.2;
	}

	.error-message {
		font-size: 18px;
		color: #666;
		margin-bottom: 40px;
		line-height: 1.7;
	}

	.error-actions {
		display: flex;
		justify-content: center;
	}

	.btn-primary {
		display: inline-block;
		background: var(--color-primary-600, #ef562f);
		color: #fff;
		padding: 14px 40px;
		border-radius: 30px;
		font-weight: 600;
		font-size: 14px;
		letter-spacing: 0.5px;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: none;
	}

	.btn-primary:hover {
		background: var(--color-primary-700, #eb4f27);
		transform: translateY(-2px);
		box-shadow: 0 10px 25px rgba(239, 86, 47, 0.35);
	}

	@media (max-width: 768px) {
		.error-card {
			padding: 50px 30px;
		}

		.error-code {
			font-size: 52px;
		}

		.error-title {
			font-size: 26px;
		}

		.error-message {
			font-size: 16px;
		}
	}
</style>
