﻿/// <reference path="../API.ts" />

/// <reference path="../library/XML.ts" />

namespace samchon.collection
{
	/**
	 * An {@link XMLList} who can detect element I/O events.
	 * 
	 * <p> Below are list of methods who are dispatching {@link CollectionEvent}: </p>
	 * 
	 * <ul>
	 *	<li> <i>insert</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link insert} </li>
	 *		<li> {@link push} </li>
	 *		<li> {@link push_front} </li>
	 *		<li> {@link push_back} </li>
	 *	</ul></li>
	 *	<li> <i>erase</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link clear} </li>
	 *		<li> {@link erase} </li>
	 *		<li> {@link pop_front} </li>
	 *		<li> {@link pop_back} </li>
	 *	</ul></li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class XMLListCollection
		extends library.XMLList
		implements ICollection<library.XML>
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
				- INSERT
				- ERASE
				- NOTIFIER
		============================================================
			INSERT
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public push<U extends library.XML>(...items: U[]): number
		{
			let ret = super.push(...items);

			this.notify_insert(this.end().advance(-items.length), this.end());

			return ret;
		}

		/**
		 * @inheritdoc
		 */
		public push_back(val: library.XML): void
		{
			super.push(val);

			this.notify_insert(this.end().prev(), this.end());
		}

		/**
		 * @hidden
		 */
		protected insert_by_repeating_val(position: std.DequeIterator<library.XML>, n: number, val: library.XML): std.DequeIterator<library.XML>
		{
			let ret = super.insert_by_repeating_val(position, n, val);

			this.notify_insert(ret, ret.advance(n));

			return ret;
		}

		/**
		 * @hidden
		 */
		protected insert_by_range<U extends library.XML, InputIterator extends std.Iterator<U>>
			(position: std.DequeIterator<library.XML>, begin: InputIterator, end: InputIterator): std.DequeIterator<library.XML>
		{
			let n: number = this.size();

			let ret = super.insert_by_range(position, begin, end);
			n = this.size() - n;

			this.notify_insert(ret, ret.advance(n));

			return ret;
		}

		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public pop_back(): void
		{
			this.notify_erase(this.end().prev(), this.end());

			super.pop_back();
		}

		/**
		 * @hidden
		 */
		protected erase_by_range(first: std.DequeIterator<library.XML>, last: std.DequeIterator<library.XML>): std.DequeIterator<library.XML>
		{
			this.notify_erase(first, last);

			return super.erase_by_range(first, last);
		}

		/* ---------------------------------------------------------
			NOTIFIER
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private notify_insert(first: std.DequeIterator<library.XML>, last: std.DequeIterator<library.XML>): void
		{
			if (this.hasEventListener(CollectionEvent.INSERT))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @hidden
		 */
		private notify_erase(first: std.DequeIterator<library.XML>, last: std.DequeIterator<library.XML>): void
		{
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
		public refresh(it: std.DequeIterator<library.XML>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.DequeIterator<library.XML>, last: std.DequeIterator<library.XML>): void;

		public refresh(...args: any[]): void
		{
			let first: std.DequeIterator<library.XML>;
			let last: std.DequeIterator<library.XML>;

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

			this.dispatchEvent(new CollectionEvent<library.XML>("refresh", first, last));
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<library.XML>): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<library.XML>): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<library.XML>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<library.XML>, thisArg: Object): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<library.XML>, thisArg: Object): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<library.XML>, thisArg: Object): void;

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
		public removeEventListener(type: "insert", listener: CollectionEventListener<library.XML>): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<library.XML>): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<library.XML>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<library.XML>, thisArg: Object): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<library.XML>, thisArg: Object): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<library.XML>, thisArg: Object): void;

		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}