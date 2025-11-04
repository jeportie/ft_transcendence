// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AbstractTableView.ts                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/04 08:42:20 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 09:20:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * AbstractTableView<T>
 * -----------------------------------------------------
 * Style-agnostic base class for dynamic tables.
 * Child classes must implement:
 *  - fetch() : Promise<T[]>
 *  - renderRow(item: T) : DocumentFragment
 * Optional:
 *  - renderMessage(type: "loading" | "empty" | "error", message?: string)
 *  - onRendered(rows: T[])
 *  - teardown()
 */
export abstract class AbstractTableView<T> {
    protected tbody: HTMLElement;

    constructor(tbody: HTMLElement) {
        if (!tbody)
            throw new Error("AbstractTableView: missing tbody element.");
        this.tbody = tbody;
    }

    /** --- Data fetching --- */
    abstract fetch(): Promise<T[]>;

    /** --- Row rendering --- */
    abstract renderRow(item: T): DocumentFragment;

    /** --- Optional message rendering (override for styling) --- */
    protected renderMessage(type: "loading" | "empty" | "error", message?: string): void {
        const text =
            message ||
            (type === "loading"
                ? "Loading..."
                : type === "empty"
                    ? "No data available."
                    : "Failed to load data.");

        // default neutral rendering (override for style)
        this.tbody.innerHTML = `<tr><td colspan="100%">${text}</td></tr>`;
    }

    /** --- Lifecycle --- */
    async load() {
        this.renderMessage("loading");
        try {
            const data = await this.fetch();
            if (!data?.length) return this.renderMessage("empty");
            this.tbody.innerHTML = "";
            for (const row of data) {
                this.tbody.appendChild(this.renderRow(row));
            }
            this.onRendered?.(data);
        } catch (err) {
            console.error("[AbstractTableView] Load failed:", err);
            this.renderMessage("error");
        }
    }

    get loadingMessage() { return "Loading..."; }
    get emptyMessage() { return "No data."; }
    get errorMessage() { return "Error loading data."; }

    get messageWrapperTag() { return "tr"; }
    get messageWrapperClass() { return ""; }

    onRendered?(data: T[]): void;
    teardown?(): void;
}
