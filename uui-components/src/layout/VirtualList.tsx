import React, { ReactNode } from 'react';
import { IHasCX, IEditable, VirtualListState, cx, IHasRawProps, useVirtualList } from '@epam/uui';
import { PositionValues, ScrollBars } from '@epam/uui-components';
import * as css from './VirtualList.scss';

export interface VirtualListProps extends IHasCX, IEditable<VirtualListState>, IHasRawProps<HTMLDivElement> {
    rows: ReactNode[];
    rowsCount?: number;
    focusedIndex?: number;
    onScroll?(value: PositionValues): void;
};

export function VirtualList({
    onValueChange,
    onScroll,
    focusedIndex,
    value,
    rows,
    rowsCount,
    rawProps,
    ...props
}: VirtualListProps) {
    const { listRef, scrollbarsRef, offsetY, handleScroll, estimatedHeight } = useVirtualList<HTMLDivElement>({
        value,
        onValueChange,
        onScroll,
        rowsCount
    });

    const renderRows = () => {
        const firstChildRole = listRef.current?.children?.[0]?.getAttribute('role');

        return (
            <div className={ css.listContainer } style={{ minHeight: `${estimatedHeight}px` }}>
                <div
                    ref={ listRef }
                    role={ firstChildRole === 'option' ? 'listbox' : firstChildRole === 'row' ? 'rowgroup' : undefined }
                    style={ { marginTop: offsetY } }>
                    { rows }
                </div>
            </div>
        );
    };

    return (
        <div className={ cx(css.wrapper, props.cx) } { ...rawProps }>
            <ScrollBars onScroll={ handleScroll } ref={ scrollbarsRef }>
                { renderRows() }
            </ScrollBars>
        </div>
    );
}