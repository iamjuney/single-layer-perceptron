<script>
	import bg from '$lib/bg.svg';
	import { Button, Modal, Toast } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { Line } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		Filler,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		Filler,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	);

	let w1, w2, bias;
	let x1 = 0,
		x2 = 1;
	let output = 0;
	let patterns = [
		[0, 0],
		[0, 1],
		[1, 0],
		[1, 1]
	];

	let rnd = Math.random;

	w1 = rnd();
	w2 = rnd();
	bias = rnd();

	let desired_output = [0, 0, 0, 1];
	let train_modal = false;
	let max_epoch = 1000;
	let learning_rate = 0.1;
	let rate_options = [0.001, 0.03, 0.01, 0.3, 0.1];
	let x_options = [0, 1];
	let logic_function = 'AND';

	let data = {
		datasets: [
			{
				label: 'Errors per epoch',
				fill: true,
				lineTension: 0.3,
				backgroundColor: 'rgba(225, 204,230, .3)',
				borderColor: '#10b981',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: '#064e3b',
				pointBackgroundColor: 'rgb(255, 255, 255)',
				pointBorderWidth: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgb(0, 0, 0)',
				pointHoverBorderColor: 'rgba(220, 220, 220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10
			}
		]
	};

	function updateDesiredOutput(event) {
		let logicFunction = event.target.value;
		if (logicFunction === 'AND') {
			desired_output = [0, 0, 0, 1];
		} else if (logicFunction === 'OR') {
			desired_output = [0, 1, 1, 1];
		}
	}

	function train() {
		w1 = rnd();
		w2 = rnd();
		bias = rnd();

		let v, delta;
		let epochs = 0;
		let error = 10;
		let error_arr = [];
		let pn; // represents the pattern number
		let patUsed = new Array(4).fill(0); // monitor the pattern

		while (error > 0 && epochs < max_epoch) {
			// reset every epoch
			patUsed.fill(0);
			error = 0;

			for (let i = 0; i < 4; i++) {
				// select a random pattern
				pn = Math.floor(Math.random() * 4);
				while (patUsed[pn] === 1) {
					pn = Math.floor(Math.random() * 4);
				}
				let z1 = patterns[pn][0];
				let z2 = patterns[pn][1];
				patUsed[pn] = 1;

				v = z1 * w1 + z2 * w2 + bias;
				output = v >= 0 ? 1 : 0;

				delta = desired_output[pn] - output;
				if (delta !== 0) {
					w1 += learning_rate * delta * z1;
					w2 += learning_rate * delta * z2;
					bias += learning_rate * delta;
				}

				error += Math.abs(delta);
			}
			epochs++;
			error_arr = [...error_arr, error];
		}

		data.labels = Array.from(Array(epochs).keys());
		data.datasets[0].data = error_arr;

		train_modal = true;
	}

	let show = false;
	let counter = 3;

	function timeout() {
		if (--counter > 0) return setTimeout(timeout, 1000);
		show = false;
	}

	function test() {
		output = x1 * w1 + x2 * w2 + bias >= 0 ? 1 : 0;

		show = true;
		counter = 3;
		timeout();
	}
</script>

<div class="min-h-full">
	<div class="m-24">
		<div class="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
			<aside class="hidden lg:block lg:col-span-5">
				<div class="sticky top-24 space-y-4">
					<section aria-labelledby="who-to-follow-heading">
						<div class="bg-white rounded-lg shadow-md">
							<div class="p-8">
								<div class="flow-root">
									<div class="space-y-6">
										<fieldset class="bg-white">
											<legend class="block text-sm font-medium text-gray-700"
												>Logical Function <span class="text-red-500">*</span></legend
											>
											<div class="mt-1 rounded-md shadow-sm -space-y-px">
												<div>
													<label for="logic_function" class="sr-only">Logical Function</label>
													<select
														on:change={updateDesiredOutput}
														id="logic_function"
														name="logic_function"
														class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
														value={logic_function}
													>
														<option value="AND">AND</option>
														<option value="OR">OR</option>
													</select>
												</div>
											</div>
										</fieldset>
										<div class="flex flex-row space-x-8">
											<fieldset class="bg-white">
												<legend class="block text-sm font-medium text-gray-700">Input</legend>
												<div class="mt-1 bg-white rounded-md shadow-sm -space-y-px">
													<div class="flex -space-x-px">
														<div class="w-1/2 flex-1 min-w-0">
															<label for="card-expiration-date" class="sr-only"
																>Expiration date</label
															>
															<input
																type="text"
																name="card-expiration-date"
																id="card-expiration-date"
																class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none rounded-tl-md bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
																value="0"
																readonly
															/>
														</div>
														<div class="flex-1 min-w-0">
															<label for="card-cvc" class="sr-only">CVC</label>
															<input
																type="text"
																name="card-cvc"
																id="card-cvc"
																class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none rounded-tr-md bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
																value="0"
																readonly
															/>
														</div>
													</div>
													<div class="flex -space-x-px">
														<div class="w-1/2 flex-1 min-w-0">
															<label for="card-expiration-date" class="sr-only"
																>Expiration date</label
															>
															<input
																type="text"
																name="card-expiration-date"
																id="card-expiration-date"
																class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
																value="0"
																readonly
															/>
														</div>
														<div class="flex-1 min-w-0">
															<label for="card-cvc" class="sr-only">CVC</label>
															<input
																type="text"
																name="card-cvc"
																id="card-cvc"
																class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
																value="1"
																readonly
															/>
														</div>
													</div>
													<div class="flex -space-x-px">
														<div class="w-1/2 flex-1 min-w-0">
															<label for="card-expiration-date" class="sr-only"
																>Expiration date</label
															>
															<input
																type="text"
																name="card-expiration-date"
																id="card-expiration-date"
																class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
																value="1"
																readonly
															/>
														</div>
														<div class="flex-1 min-w-0">
															<label for="card-cvc" class="sr-only">CVC</label>
															<input
																type="text"
																name="card-cvc"
																id="card-cvc"
																class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
																value="0"
																readonly
															/>
														</div>
													</div>
													<div class="flex -space-x-px">
														<div class="w-1/2 flex-1 min-w-0">
															<label for="card-expiration-date" class="sr-only"
																>Expiration date</label
															>
															<input
																type="text"
																name="card-expiration-date"
																id="card-expiration-date"
																class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none rounded-bl-md bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
																value="1"
																readonly
															/>
														</div>
														<div class="flex-1 min-w-0">
															<label for="card-cvc" class="sr-only">CVC</label>
															<input
																type="text"
																name="card-cvc"
																id="card-cvc"
																class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none rounded-br-md bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
																value="1"
																readonly
															/>
														</div>
													</div>
												</div>
											</fieldset>
											<fieldset class="bg-white">
												<legend class="block text-sm font-medium text-gray-700"
													>Desired Output</legend
												>
												<div class="mt-1 bg-white rounded-md shadow-sm -space-y-px">
													<div>
														<label for="card-number" class="sr-only">Card number</label>
														<input
															type="text"
															name="card-number"
															id="card-number"
															class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none rounded-t-md bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
															value={desired_output[0]}
															readonly
														/>
													</div>
													<div>
														<label for="card-number" class="sr-only">Card number</label>
														<input
															type="text"
															name="card-number"
															id="card-number"
															class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
															value={desired_output[1]}
															readonly
														/>
													</div>
													<div>
														<label for="card-number" class="sr-only">Card number</label>
														<input
															type="text"
															name="card-number"
															id="card-number"
															class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
															value={desired_output[2]}
															readonly
														/>
													</div>
													<div>
														<label for="card-number" class="sr-only">Card number</label>
														<input
															type="text"
															name="card-number"
															id="card-number"
															class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-none rounded-b-md bg-gray-100 focus:z-10 sm:text-sm border-gray-300"
															value={desired_output[3]}
															readonly
														/>
													</div>
												</div>
											</fieldset>
										</div>
										<fieldset class="bg-white">
											<legend class="block text-sm font-medium text-gray-700"
												>Max Epoch <span class="text-red-500">*</span></legend
											>
											<div class="mt-1 bg-white rounded-md shadow-sm -space-y-px">
												<div>
													<label for="epoch" class="sr-only">Max Epoch</label>
													<input
														type="number"
														name="epoch"
														id="epoch"
														class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
														value={max_epoch}
														placeholder="Epoch number"
													/>
												</div>
											</div>
										</fieldset>
										<fieldset class="bg-white">
											<legend class="block text-sm font-medium text-gray-700"
												>Learning Rate <span class="text-red-500">*</span></legend
											>
											<div class="mt-1 rounded-md shadow-sm -space-y-px">
												<div>
													<label for="rate" class="sr-only">Learning Rate</label>
													<select
														id="rate"
														name="rate"
														autocomplete="country-name"
														class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
														bind:value={learning_rate}
													>
														{#each rate_options as value}<option {value}>{value}</option>{/each}
													</select>
												</div>
											</div>
										</fieldset>
									</div>
								</div>
								<div class="mt-6">
									<Button
										btnClass="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
										on:click={train}
										autoclose>Train</Button
									>
									<Modal title="Training Results" bind:open={train_modal}>
										<Line {data} options={{ responsive: true }} />
									</Modal>
								</div>
							</div>
						</div>
					</section>
					<section aria-labelledby="who-to-follow-heading">
						<div class="bg-white rounded-lg shadow-md">
							<div class="p-8">
								<div class="flow-root">
									<div class="space-y-6">
										<fieldset class="bg-white">
											<legend class="block text-sm font-medium text-gray-700"
												>X <sub>1</sub> <span class="text-red-500">*</span></legend
											>
											<div class="mt-1 bg-white rounded-md shadow-sm -space-y-px">
												<div>
													<label for="card-number" class="sr-only">Epoch</label>
													<select
														id="rate"
														name="rate"
														autocomplete="country-name"
														class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
														bind:value={x1}
													>
														{#each x_options as value}<option {value}>{value}</option>{/each}
													</select>
												</div>
											</div>
										</fieldset>
										<fieldset class="bg-white">
											<legend class="block text-sm font-medium text-gray-700"
												>X <sub>2</sub> <span class="text-red-500">*</span></legend
											>
											<div class="mt-1 bg-white rounded-md shadow-sm -space-y-px">
												<div>
													<label for="card-number" class="sr-only">Epoch</label>
													<select
														id="rate"
														name="rate"
														autocomplete="country-name"
														class="focus:ring-emerald-500 focus:border-emerald-500 relative block w-full rounded-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
														bind:value={x2}
													>
														{#each x_options as value}<option {value}>{value}</option>{/each}
													</select>
												</div>
											</div>
										</fieldset>
									</div>
								</div>
								<div class="mt-6">
									<Button
										btnClass="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
										on:click={test}
										autoclose>Test</Button
									>
									<Toast
										simple
										transition={slide}
										bind:open={show}
										divClass="mt-6 w-full h-16 flex flex-col justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-800"
									>
										Output: {output}
									</Toast>
								</div>
							</div>
						</div>
					</section>
				</div>
			</aside>
			<main class="lg:col-span-7">
				<div class="mt-4 px-2">
					<div class="space-y-4 prose lg:prose-md">
						<h2 class="text-emerald-700 font-bold text-4xl">Perceptron</h2>
						<p>
							Perceptron was introduced by Frank emeraldnblatt in 1957. He proposed a Perceptron
							learning rule based on the original MCP neuron. A Perceptron is an algorithm for
							supervised learning of binary classifiers. This algorithm enables neurons to learn and
							processes elements in the training set one at a time.
						</p>

						<img
							src="https://www.simplilearn.com/ice9/free_resources_article_thumb/Perceptron/general-diagram-of-perceptron-for-supervised-learning_4.jpg"
							alt="Perceptron"
						/>

						<h3>Types of Perceptron:</h3>
						<p>
							1. Single layer: Single layer perceptron can learn only linearly separable patterns.
							2. Multilayer: Multilayer perceptrons can learn about two or more layers having a
							greater processing power.
						</p>
						<p>
							The Perceptron algorithm learns the weights for the input signals in order to draw a
							linear decision boundary.
						</p>
						<p>
							Note: Supervised Learning is a type of Machine Learning used to learn models from
							labeled training data. It enables output prediction for future or unseen data. Let us
							focus on the Perceptron Learning Rule in the next section.
						</p>

						<h3>Perceptron in Machine Learning</h3>
						<p>
							The most commonly used term in Artificial Intelligence and Machine Learning (AIML) is
							Perceptron. It is the beginning step of learning coding and Deep Learning
							technologies, which consists of input values, scores, thresholds, and weights
							implementing logic gates. Perceptron is the nurturing step of an Artificial Neural
							Link. In 19h century, Mr. Frank Rosenblatt invented the Perceptron to perform specific
							high-level calculations to detect input data capabilities or business intelligence.
							However, now it is used for various other purposes.
						</p>

						<h3>What is the Perceptron Model in Machine Learning?</h3>
						<p>
							A machine-based algorithm used for supervised learning of various binary sorting tasks
							is called Perceptron. Furthermore, Perceptron also has an essential role as an
							Artificial Neuron or Neural link in detecting certain input data computations in
							business intelligence. A perceptron model is also classified as one of the best and
							most specific types of Artificial Neural networks. Being a supervised learning
							algorithm of binary classifiers, we can also consider it a single-layer neural network
							with four main parameters: input values, weights and Bias, net sum, and an activation
							function.
						</p>

						<h3>How Does Perceptron Work?</h3>
						<p>
							AS discussed earlier, Perceptron is considered a single-layer neural link with four
							main parameters. The perceptron model begins with multiplying all input values and
							their weights, then adds these values to create the weighted sum. Further, this
							weighted sum is applied to the activation function 'f' to obtain the desired output.
							This activation function is also known as the step function and is represented by 'f'.
						</p>

						<img
							src="https://www.simplilearn.com/ice9/free_resources_article_thumb/Perceptron_work.png"
							alt="How Perceptron Work"
						/>

						<p>
							This step function or Activation function is vital in ensuring that output is mapped
							between (0,1) or (-1,1). Take note that the weight of input indicates a node's
							strength. Similarly, an input value gives the ability the shift the activation
							function curve up or down.
						</p>

						<p>
							Step 1: Multiply all input values with corresponding weight values and then add to
							calculate the weighted sum. The following is the mathematical expression of it:
						</p>

						<p>∑wi*xi = x1*w1 + x2*w2 + x3*w3+……..x4*w4</p>

						<p>
							Add a term called bias 'b' to this weighted sum to improve the model's performance.
						</p>

						<p>
							Step 2: An activation function is applied with the above-mentioned weighted sum giving
							us an output either in binary form or a continuous value as follows:
						</p>

						<p>Y=f(∑wi*xi + b)</p>
						<br /><br />
						<h4>
							Credits: <a
								href="https://www.simplilearn.com/tutorials/deep-learning-tutorial/perceptron"
								>www.simplilearn.com</a
							>
						</h4>

						<!-- More questions... -->
					</div>
				</div>
			</main>
		</div>
	</div>
</div>

<img
	style="transform: skewX(-20deg);"
	class="inset-0 w-1/3 h-full object-cover -z-50 absolute"
	src={bg}
	alt="Employee Illustration"
/>
