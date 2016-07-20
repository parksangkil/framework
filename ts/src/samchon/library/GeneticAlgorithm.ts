﻿/// <reference path="../API.ts" />

namespace samchon.library
{
	/**
	 * <p> A genetic algorithm class. </p>
	 * 
	 * @details
	 * <p> In the field of artificial intelligence, a genetic algorithm (GA) is a search heuristic that mimics the 
	 * process of natural selection. This heuristic (also sometimes called a metaheuristic) is routinely used to generate 
	 * useful solutions to optimization and search problems. </p>
	 *
	 * <p> Genetic algorithms belong to the larger class of evolutionary algorithms (EA), which generate solutions to 
	 * optimization problems using techniques inspired by natural evolution, such as inheritance, {@link mutate mutation}, 
	 * {@link selection}, and {@link crossover}. </p>
	 * 
	 * @reference https://en.wikipedia.org/wiki/Genetic_algorithm
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class GeneticAlgorithm
	{
		/**
		 * Whether each element (Gene) is unique in their GeneArray.
		 */
		private unique: boolean;

		/**
		 * Rate of mutation.
		 * 
		 * The {@link mutation_rate} determines the percentage of occurence of mutation in GeneArray.
		 * 
		 * <ul>
		 *	<li> When {@link mutation_rate} is too high, it is hard to ancitipate studying on genetic algorithm. </li>
		 *	<li>
		 *		When {@link mutation_rate} is too low and initial set of genes (GeneArray) is far away from optimal, the 
		 *		evolution tends to wandering outside of he optimal.
		 *	</li>
		 * </ul>
		 */
		private mutation_rate: number;

		/**
		 * Number of tournaments in selection.
		 */
		private tournament: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS AND MAIN PROCEDURES
		--------------------------------------------------------- */
		/**
		 * Initialization Constructor.
		 * 
		 * @param unique Whether each Gene is unique in their GeneArray.
		 * @param mutation_rate Rate of mutation.
		 * @param tournament Number of tournaments in selection.
		 */
		public constructor(unique: boolean = true, mutation_rate: number = .015, tournament: number = 10)
		{
			this.unique = unique;
			this.mutation_rate = mutation_rate;
			this.tournament = tournament;
		}

		/**
		 * <p> Evolove <i>GeneArray</i>. </p>
		 * 
		 * <p> Convenient method accessing to {@link evolvePopulation evolvePopulation()}. </p>
		 * 
		 * @param individual An initial set of genes; sequence listing.
		 * @param population Size of population in a generation.
		 * @param generation Size of generation in evolution.
		 * 
		 * @return An evolved <i>GeneArray</i>, optimally.
		 */
		public evolveGeneArray<T, GeneArray extends std.base.IArrayContainer<T>>
			(individual: GeneArray, population: number, generation: number): GeneArray
		{
			let ga_population = new GAPopulation(individual, population);

			for (let i: number = 0; i < generation; i++)
				ga_population = this.evolvePopulation(ga_population);

			return ga_population.fitTest();
		}

		/**
		 * Evolve <i>population</i>, a mass of <i>GeneArraies</i>.
		 * 
		 * @param population An initial population.
		 */
		public evolvePopulation<T, GeneArray extends std.base.IArrayContainer<T>>
			(population: GAPopulation<T, GeneArray>): GAPopulation<T, GeneArray>
		{
			let size: number = population["children"].size();
			let evolved = new GAPopulation<T, GeneArray>(size);

			// ELITICISM
			evolved["children"].set(0, population.fitTest());

			for (let i: number = 1; i < size; i++)
			{
				let gene1: GeneArray = this.selection(population);
				let gene2: GeneArray = this.selection(population);

				let child: GeneArray = this.crossover(gene1, gene2);
				this.mutate(child);

				evolved["children"].set(i, child);
			}

			return evolved;
		}

		/* ---------------------------------------------------------
			MAIN LOGICS
		--------------------------------------------------------- */
		/**
		 * <p> Select the best GeneArray in <i>population</i> from tournament. </p>
		 *
		 * <p> {@link selection Selection} is the stage of a genetic algorithm in which individual genomes are chosen 
		 * from a population for later breeding (using {@linlk crossover} operator). A generic {@link selection} 
		 * procedure may be implemented as follows: </p>
		 *
		 * <ol>
		 *	<li>
		 *		The fitness function is evaluated for each individual, providing fitness values, which are then 
		 *		normalized. Normalization means dividing the fitness value of each individual by the sum of all fitness 
		 *		values, so that the sum of all resulting fitness values equals 1.
		 *	</li>
		 *	<li> The population is sorted by descending fitness values. </li>
		 *	<li>
		 *		Accumulated normalized fitness values are computed (the accumulated fitness value of an individual is the 
		 *		sum of its own fitness value plus the fitness values of all the previous individuals). The accumulated 
		 *		fitness of the last individual should be 1 (otherwise something went wrong in the normalization step).
		 *	</li>
		 *	<li> A random number R between 0 and 1 is chosen. </li>
		 *	<li> The selected individual is the first one whose accumulated normalized value is greater than R. </li>
		 * </ol>
		 * 
		 * @param population The target of tournament.
		 * @return The best genes derived by the tournament.
		 * 
		 * @reference https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)
		 */
		private selection<T, GeneArray extends std.base.IArrayContainer<T>>
			(population: GAPopulation<T, GeneArray>): GeneArray
		{
			let size: number = population["children"].size();
			let tournament: GAPopulation<T, GeneArray> = new GAPopulation<T, GeneArray>(size);

			for (let i: number = 0; i < size; i++)
			{
				let random_index: number = Math.floor(Math.random() * size);
				if (random_index == size)
					random_index--;

				tournament["children"].set(i, population["children"].at(random_index));
			}
			return tournament.fitTest();
		}

		/**
		 * <p> Create a new GeneArray by crossing over two <i>GeneArray</i>(s). </p>
		 *
		 * <p> {@link crossover} is a genetic operator used to vary the programming of a chromosome or chromosomes from 
		 * one generation to the next. It is analogous to reproduction and biological crossover, upon which genetic 
		 * algorithms are based. </p>
		 *
		 * <p> {@link crossover Cross over} is a process of taking more than one parent solutions and producing a child 
		 * solution from them. There are methods for selection of the chromosomes. </p>
		 *
		 * @param parent1 A parent sequence listing
		 * @param parent2 A parent sequence listing
		 * 
		 * @reference https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
		 */
		private crossover<T, GeneArray extends std.base.IArrayContainer<T>>
			(parent1: GeneArray, parent2: GeneArray): GeneArray
		{
			let individual: GeneArray = parent1.constructor(parent1);
			let size: number = parent1.size();

			if (this.unique == false)
			{
				for (let i: number = 0; i < size; i++)
					if (Math.random() > .5)
						individual.set(i, parent1.at(i));
			}
			else
			{
				let ptr_set: std.HashSet<T> = new std.HashSet<T>();
				let index_set: std.HashSet<number> = new std.HashSet<number>();

				// RANGES
				let first: number = Math.random() * size;
				let last: number = Math.random() * size;

				if (first > last)
					[first, last] = [last, first];

				// INDEXING
				for (let i: number = 0; i < size; i++)
					if (first <= i && i < last)
						ptr_set.insert(parent1.at(i));
					else
						index_set.insert(i);

				// INSERT PARENT_2
				for (let i: number = 0; i < size; i++)
				{
					let ptr: T = parent2.at(i);
					if (ptr_set.find(ptr).equal_to(ptr_set.end()) == false)
						continue;

					individual.set(index_set.begin().value, ptr);
					index_set.erase(index_set.begin());
				}
			}
			return individual;
		}

		/**
		 * <p> Cause a mutation on the <i>GeneArray</i>. </p>
		 * 
		 * <p> {@link mutate Mutation} is a genetic operator used to maintain genetic diversity from one generation of a 
		 * population of genetic algorithm chromosomes to the next. It is analogous to biological mutation. </p>
		 *
		 * <p> {@link mutate Mutation} alters one or more gene values in a chromosome from its initial state. In 
		 * {@link mutate mutation}, the solution may change entirely from the previous solution. Hence GA can come to
		 * better solution by using {@link mutate mutation}. </p>
		 *
		 * <p> {@link mutate Mutation} occurs during evolution according to a user-definable mutation probability. This 
		 * probability should be set low. If it is set too high, the search will turn into a primitive random search. </p>
		 *
		 * <h4> Note </h4>
		 * <p> Muttion is pursuing diversity. Mutation is useful for avoiding the following problem. </p>
		 *
		 * <p> When initial set of genes(GeneArray) is far away from optimail, without mutation (only with selection and 
		 * crossover), the genetic algorithm has a tend to wandering outside of the optimal. </p>
		 *
		 * <p> Genes in the GeneArray will be swapped following percentage of the {@link mutation_rate}. </p>
		 *
		 * @param individual A container of genes to mutate
		 * 
		 * @reference https://en.wikipedia.org/wiki/Mutation_(genetic_algorithm)
		 * @see {@link mutation_rate}
		 */
		private mutate<T, GeneArray extends std.base.IArrayContainer<T>>
			(individual: GeneArray): void
		{
			for (let it = individual.begin(); !it.equal_to(individual.end()); it = it.next())
			{
				if (Math.random() > this.mutation_rate)
					continue;

				// JUST SHUFFLE SEQUENCE OF GENES
				let j: number = Math.floor(Math.random() * individual.size());
				it.swap(individual.begin().advance(j));
			}
		}
	}

	export class GAPopulation<T, GeneArray extends std.base.IArrayContainer<T>>
	{
		private children: std.Vector<GeneArray>;
		private compare: (left: GeneArray, right: GeneArray) => boolean;
		
		public constructor(size: number);

		public constructor(geneArray: GeneArray, size: number);

		public constructor(geneArray: GeneArray, size: number, compare: (left: GeneArray, right: GeneArray) => boolean);

		public constructor(...args: any[])
		{
			if (args.length == 1)
			{
				this.children = new std.Vector<GeneArray>();
				this.children.length = args[0] as number;
			}
			else
			{
				let geneArray: GeneArray = args[0];
				let size: number = args[1];
				let compare: (left: GeneArray, right: GeneArray) => boolean = (args.length == 2) ? std.less : args[2];

				this.children = new std.Vector<GeneArray>();
				this.children.length = args[1] as number;
				this.compare = compare;

				for (let i: number = 0; i < size; i++)
				{
					let child: GeneArray = this.clone(geneArray);

					if (i > 0) // DO NOT TOUCH THE FIRST, THE ELITEST ELEMENT; ELITICISM
						std.random_shuffle
						(
							child.begin() as std.base.IArrayIterator<T>,
							child.end() as std.base.IArrayIterator<T>
						);
					this.children[i] = child;
				}
			}
		}

		public fitTest(): GeneArray
		{
			let best: GeneArray = this.children.front();

			for (let i: number = 1; i < this.children.size(); i++)
				if (this.compare(this.children.at(i), best) == true)
					best = this.children.at(i);

			return best;
		}

		private clone(obj: GeneArray): GeneArray
		{
			var ret: GeneArray = obj.constructor();

			for (let key in obj)
				if (obj.hasOwnProperty(key) == true)
					ret[key] = obj[key];

			return ret;
		}
	}
}