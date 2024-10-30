<script lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
	content: string;
	author: string;
}

export default {
	name: 'RandomQuote',
	setup() {
		const error = ref<string | null>(null);
		const loading = ref<boolean>(false);
		const quote = ref<Props | null>(null);
		const history = ref<Props[]>([]);

		const fetchQuote = async () => {
			try {
				loading.value = true;
				error.value = null;
				quote.value = null;

				const response = await fetch(`https://corsproxy.io/?${encodeURIComponent('https://zenquotes.io/api/random')}`);
				const data = await response.json();
				quote.value = { content: data[0].q, author: data[0].a };
				history.value.unshift({ content: data[0].q, author: data[0].a });
			} catch {
				error.value = 'There was an error when loading quotes.';
			} finally {
				loading.value = false;
			}
		};

		const copyQuote = () => {
			if (quote.value) {
				const textToCopy = `"${quote.value.content}" - ${quote.value.author}`;
				navigator.clipboard.writeText(textToCopy).then(() => {
					alert("The quote is copied in the clipboard!");
				}).catch(() => {
					alert("Failed to copy the quote.");
				});
			}
		};

		const resetHistory = () => {
			history.value = [];
		};

		onMounted(fetchQuote);

		return { quote, error, fetchQuote, copyQuote, history, resetHistory, loading };
	}
};
</script>

<template>
	<div class="quote-container">
		<h1>Random Quote</h1>
		<p
			v-if="loading"
			class="loading"
		>Loading...</p>

		<div v-else>
			<p
				v-if="error"
				class="error"
			>{{ error }}</p>
			<blockquote
				v-else
				class="quote"
			>
				<p>{{ quote?.content }}</p>
				<footer>- {{ quote?.author }}</footer>
			</blockquote>
			<div class="buttons">
				<button
					@click="fetchQuote"
					class="button"
				>New Quote</button>
				<button
					v-if="quote"
					@click="copyQuote"
					class="button"
				>Copy Quote</button>
			</div>
			<h2>History</h2>
			<button
				@click="resetHistory"
				class="reset-button"
			>Delete History</button>
			<ul
				v-if="history.length"
				class="history-list"
			>
				<li
					v-for="(item, index) in history"
					:key="index"
				>{{ item.content }} - {{ item.author }}</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.quote-container {
	text-align: center;
	padding: 20px;
	max-width: 600px;
	margin: auto;
	background: #f9f9f9;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
	font-size: 2em;
	margin-bottom: 20px;
	color: #202020;
}

.loading {
	font-size: 1.2em;
	color: #383838;
}

.error {
	color: #ff4d4d;
}

.quote {
	font-style: italic;
	margin: 20px 0;
	padding: 10px;
	background: #fff;
	border-left: 4px solid #4caf50;
}

.quote p {
	background: #79858d;
	margin: 0;
}

.quote footer {
	background: #79858d;
	text-align: right;
	font-weight: bold;
}

.buttons {
	margin: 20px 0;
}

.button {
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 5px;
	padding: 10px 20px;
	margin: 5px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.button:hover {
	background-color: #45a049;
}

.reset-button {
	background-color: #f44336;
}

.reset-button:hover {
	background-color: #d32f2f;
}

.history-list {
	list-style-type: none;
	padding: 0;
	margin: 20px 0;
}

.history-list li {
	background: #79858d;
	margin: 5px 0;
	padding: 10px;
	border-radius: 5px;
}
</style>
