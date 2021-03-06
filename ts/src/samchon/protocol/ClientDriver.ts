﻿/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	/**
	 * 
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IClientDriver extends ICommunicator
	{
		/**
		 * <p> Listen message from the newly connected client. </p>
		 * 
		 * <p> Starts listening message from the newly connected client. Replied message from the connected client will
		 * be converted to {@link Invoke} classes and shifted to the <i>listener</i>'s 
		 * {@link IProtocol.replyData replyData()} method. </p>
		 * 
		 * @param listener A listener object to listen replied message from newly connected client in 
		 *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} message.
		 */
		listen(listener: IProtocol): void;
	}
}

namespace samchon.protocol
{
	export class NormalClientDriver 
		extends NormalCommunicator
		implements IClientDriver
	{
		public constructor(socket: socket.socket)
		{
			super();

			this.socket = socket;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener = listener;
			
			this.start_listen();
		}
	}
}

namespace samchon.protocol
{
	export class WebClientDriver
		extends WebCommunicator
		implements IClientDriver
	{
		/**
		 * Requested path.
		 */
		private path: string;

		/**
		 * Session ID, an identifier of the remote client.
		 */
		private session_id: string;

		private listening_: boolean;

		/**
		 * Initialization Constructor.
		 * 
		 * @param connection Connection driver, a socket for web-socket.
		 * @param path Requested path.
		 * @param session_id Session ID, an identifier of the remote client.
		 */
		public constructor(connection: websocket.connection, path: string, session_id: string)
		{
			super();

			this.connection = connection;
			this.path = path;
			this.session_id = session_id;

			this.listening_ = false;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener = listener;

			if (this.listening_ == false)
			{
				this.listening_ = true;

				this.connection.on("message", this.handle_message.bind(this));
				this.connection.on("close", this.handle_close.bind(this));
				this.connection.on("error", this.handle_close.bind(this));
			}
		}

		/**
		 * Get requested path.
		 */
		public getPath(): string
		{
			return this.path;
		}

		/**
		 * Get session ID, an identifier of the remote client.
		 */
		public getSessionID(): string
		{
			return this.session_id;
		}
	}
}

namespace samchon.protocol
{
	export class SharedWorkerClientDriver 
		implements IClientDriver
	{
		private listener: IProtocol;

		/**
		 * @inheritdoc
		 */
		public onClose: Function;

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener = listener;
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
		}

		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
		}

		/**
		 * @inheritdoc
		 */
		public replyData(invoke: Invoke): void
		{
			this.listener.replyData(invoke);
		}
	}
}