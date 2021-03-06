﻿/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link TreeMap} who can detect element I/O events.
	 * 
	 * <ul>
	 *	<li> <i>insert</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link insert} </li>
	 *		<li> {@link push} </li>
	 *		<li> {@link set} </li>
	 *		<li> {@link insert_or_assign} </li>
	 *	</ul></li>
	 *	<li> <i>erase</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link clear} </li>
	 *		<li> {@link erase} </li>
	 *		<li> {@link extract} </li>
	 *	</ul></li>
	 *	<li> <i>refresh</i> typed events: <ul>
	 *		<li> {@link set} </li>
	 *		<li> {@link insert_or_assign} </li>
	 *	</ul></li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class TreeMapCollection<Key, T>
		extends std.TreeMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
	{
		/**
		 * A chain object taking responsibility of dispatching events.
		 */
		private event_dispatcher_: library.EventDispatcher = new library.EventDispatcher(this);

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/* =========================================================
			ELEMENTS I/O
				- HANDLE_INSERT & HANDLE_ERASE
		============================================================
			HANDLE_INSERT & HANDLE_ERASE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super.handle_insert(first, last);

			if (this.hasEventListener(CollectionEvent.INSERT))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super.handle_erase(first, last);

			if (this.hasEventListener(CollectionEvent.ERASE))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.ERASE, first, last));
		}

		/* =========================================================
			EVENT_DISPATCHER
				- ACCESSORS
				- ADD
				- REMOVE
		============================================================
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.event_dispatcher_.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.event_dispatcher_.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public refresh(): void;

		/**
		 * @inheritdoc
		 */
		public refresh(it: std.MapIterator<Key, T>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;

		public refresh(...args: any[]): void
		{
			let first: std.MapIterator<Key, T>;
			let last: std.MapIterator<Key, T>;

			if (args.length == 0)
			{
				first = this.begin();
				last = this.end();
			}
			else if (args.length == 1)
			{
				first = args[0];
				last = first.next();
			}
			else
			{
				first = args[0];
				last = args[1];
			}

			this.dispatchEvent(new CollectionEvent<std.Pair<Key, T>>("refresh", first, last));
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;

		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.addEventListener(type, listener, thisArg);
		}

		/* ---------------------------------------------------------
			REMOVE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;

		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}