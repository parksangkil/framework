﻿/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

namespace samchon.protocol.external
{
	/**
	 * <p> An interface for an {@link ExternalSystemArray} accepts {@link ExternalSystem external clients} as a
	 * {@link IServer server} and connects to {@link IExternalServer} as <b>client</b>, at the same time. </p>
	 * 
	 * <p> The easiest way to defining an {@link IExternalServerClientArray} who opens server, accepts
	 * {@link ExternalSystem external clients} and connects to {@link IExternalServer external servers} is to extending 
	 * one of below, who are derived from this interface {@link IExternalServerClientArray}. However, if you can't 
	 * specify an {@link ExternalSystemArray} to be whether server or client or even can both them, then make a class 
	 * (let's name it as <b>BaseSystemArray</b>) extending {@link ExternalSystemArray} and make a new class (now, I name 
	 * it <b>BaseServerClientArray</b>) extending <b>BaseSystemArray</b> and implementing this interface 
	 * {@link IExternalServerClientArray}. Define the <b>BaseServerClientArray</b> following those codes on below:
	 * 
	 * <ul>
	 *	<li> {@link ExternalServerClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalServerClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link ParallelServerClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/ParallelServerClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link DistributedServerClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/DistributedServerClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IExternalServerClientArray
		extends IExternalServerArray, IExternalClientArray
	{
	}

	/**
	 * <p> An {@link ExternalSystemArray} connecting to {@link IExternalServer external servers} as a <b>client</b> and
	 * accepts {@link ExternalSystem external clients} as a {@link IServer server}. </p>
	 * 
	 * <p> {@link ExternalServerArray} is an abstract class contains, manages and connects to external server drivers, 
	 * {@link IExternalServer} objects and accepts external client drivers {@link ExternalSyste} obejcts as a 
	 * <b>client</b> and a {@link IServer server} at the same time. </p>
	 *
	 * <p> <a href="http://samchon.github.io/framework/api/ts/assets/images/design/protocol_external_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/api/ts/assets/images/design/protocol_external_system.png"
	 *		 style="max-width: 100%" />
	 * </a> </p>
	 *
	 * <h4> Proxy Pattern </h4>
	 * <p> The {@link ExternalSystemArray} class can use <i>Proxy Pattern</i>. In framework within user, which
	 * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
	 * important. Only interested in user's perspective is <i>which can be done</i>. </p>
	 *
	 * <p> By using the <i>logical proxy</i>, user dont't need to know which {@link ExternalSystemRole role} is belonged
	 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
	 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}. </p>
	 *
	 * <ul>
	 *	<li>
	 *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
	 *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
	 *	</li>
	 *	<li>
	 *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
	 *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
	 *		external system.
	 *	</li>
	 *	<li> Those strategy is called <i>Proxy Pattern</i>. </li>
	 * </ul>
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalServerClientArray
		extends ExternalClientArray
		implements IExternalServerClientArray
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		/**
		 * <p> Factory method of a child Entity. </p>
		 *
		 * <p> This method is migrated to {@link createExternalServer createExternalServer()}. Override the
		 * {@link createExternalServer createExternalServer()}. </p>
		 *
		 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
		 * 
		 * @return A new child Entity via {@link createExternalServer createExternalServer()}.
		 */
		protected createChild(xml: library.XML): ExternalSystem
		{
			return this.createExternalServer(xml) as ExternalSystem;
		}

		/**
		 * Factory method creating an {@link IExternalServer} object.
		 *
		 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
		 * 
		 * @return A new {@link IExternalServer} object.
		 */
		protected abstract createExternalServer(xml: library.XML): IExternalServer;

		/* ---------------------------------------------------------
			METHOD OF CLIENT
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as IExternalServer).connect();
		}
	}
}