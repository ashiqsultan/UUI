import React, { useCallback, useEffect, useMemo, useState } from "react";
import css from "./DemoTablePaged.scss";
import { DataTable, FlexRow, Paginator, Button, FlexSpacer } from "@epam/promo";
import { DataQueryFilter, DataRowOptions, DataTableState, LazyDataSourceApi, useLazyDataSource, useTableState } from "@epam/uui-core";
import { Person } from "@epam/uui-docs";
import { svc } from "../../services";
import { PersonTableFilter } from "./types";
import { getFilters, mapFilter } from "./data";
import { personColumns } from "./columns";
import { FiltersToolbar } from "./DynamicFilters";

export const DemoTablePaged: React.FC = () => {
    const filters = useMemo(getFilters, []);

    const {tableState, setTableState} = useTableState({
        columns: personColumns,
    });
    
    useEffect(() => {
        setTableState({...tableState, page: 1, pageSize: 100});
    }, []);
    
    const [totalCount, setTotalCount] = useState(0);
    const [appliedFilter, setAppliedFilter] = useState<DataTableState>({});
    
    const api: LazyDataSourceApi<Person, number, PersonTableFilter> = useCallback(async request => {
        const result = await svc.api.demo.personsPaged({
            filter: mapFilter(request.filter) as DataQueryFilter<Person>,
            page: request.page - 1,
            pageSize: request.pageSize,
        });
        setTotalCount(result.totalCount);
        result.count = result.items.length;
        result.totalCount = result.items.length;
        result.from = 0;
        return result;
    }, []);
    
    const applyFilter = useCallback(() => {
        setAppliedFilter(tableState.filter);
        setTableState({ ...tableState, indexToScroll: 0 });
    }, [tableState]);
    
    // applying filter after parsing initial filter data from url
    useEffect(() => {
        applyFilter();
    }, []);
    
    const dataSource = useLazyDataSource({
        api,
    }, [api]);
    
    const rowOptions: DataRowOptions<Person, number> = {
        checkbox: { isVisible: true },
        isSelectable: true,
        onClick(rowProps) {
            rowProps.onSelect(rowProps);
        },
    };

    const viewTableState = useMemo(() => ({
        ...tableState,
        filter: appliedFilter,
    }), [tableState, appliedFilter]);
    const personsDataView = dataSource.useView(viewTableState, setTableState, {
        rowOptions,
        isFoldedByDefault: () => true,
        cascadeSelection: true,
    });
    
    return (
        <div className={ css.container }>
            <FiltersToolbar
                filters={ filters }
                tableState={ tableState }
                setTableState={ setTableState }
            />
            
            <DataTable
                headerTextCase="upper"
                getRows={ personsDataView.getVisibleRows }
                columns={ personColumns }
                filters={ filters }
                showColumnsConfig
                value={ tableState }
                onValueChange={ setTableState }
                allowColumnsResizing
                { ...personsDataView.getListProps() }
            />

            <FlexRow size="36" padding="12" background="gray5">
                <FlexSpacer/>
                <Paginator
                    value={ tableState.page }
                    onValueChange={ (page: number) => setTableState({...tableState, page, indexToScroll: 0 }) }
                    totalPages={ Math.ceil(totalCount / tableState.pageSize) }
                    size="30"
                />
                <FlexSpacer/>
            </FlexRow>

            <FlexRow vPadding="12" background="white">
                <Button caption="Apply filter" onClick={ applyFilter } cx={ css.apply }/>
            </FlexRow>
        </div>
    );
};