import { Add, FormClose } from 'grommet-icons';
import { Box, Button, CheckBox, DataTable, Heading, SelectMultiple, Text, TextInput } from 'grommet';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Scrollbars } from 'react-custom-scrollbars-2';

class Item {
    id: string = ""
    label: string = ""
    value: boolean = true
}
class ItemRow extends Item {
    addItemElement?: Element
    checkboxElement?: Element
    labelElement?: Element
    doneElement?: Element
}
type ExListProps = {
    uuid?: string
}
class ListObject {
    id: string = ""
    name: string = ""
    items: Item[] = []
}
enum FilterTag {
    ALL = "all",
    ORIGINAL = "original",
    NEW = "new",
    SELECTED = "selected",
    UNSELECTED = "unselected",
    DONE = "done"
}

const ExList = ({ uuid = "uuid-1" }: ExListProps) => {


    const tableBoxRef = useRef(null)

    const [list, setList] = useState(new ListObject())

    const [items, setItems] = useState([] as Item[])
    const itemsIds = useMemo(() => items.map((obj) => obj.id), [items])
    const isOriginal = useCallback((id: Item["id"]) => list.items.map(item => item.id).includes(id), [list])
    const isNew = useCallback((id: Item["id"]) => !isOriginal(id), [isOriginal])

    const [checked, setChecked] = useState([] as Item["id"][]);
    const isChecked = useCallback((id: Item["id"]) => checked.includes(id), [checked])
    const isUnchecked = useCallback((id: Item["id"]) => !isChecked(id), [isChecked])
    const checkedExclude = useCallback((id: Item["id"]) => checked.filter((checkedItemId) => checkedItemId !== id), [checked])

    const [done, setDone] = useState([] as Item["id"][])
    const isDone = useCallback((id: Item["id"]) => done.includes(id), [done])
    const doneExclude = useCallback((id: Item["id"]) => done.filter((doneItemId) => doneItemId !== id), [done])

    const [newItem, setNewItem] = useState({} as Item)
    const [selectedFilter, setSelectedFilter] = useState([FilterTag.ALL]);
    const onDeselectFilter = useCallback((filterToDisable: string) => {
        if (filterToDisable !== FilterTag.ALL) {
            setSelectedFilter(
                selectedFilter.filter((itemFilter) =>
                    filterToDisable !== itemFilter
                )
            )
        }
    }, [selectedFilter])

    useEffect(() => {
        (async () => {
            if (uuid) {
                const res = await fetch(`/list/${uuid}.json`, {
                    method: "GET",
                    headers: {
                        'Accept': "application/json"
                    }
                })
                const list = await res.json() as ListObject
                setList(list)
                setItems(list.items)
            }
        })()
    }, [uuid])

    useEffect(() => {
        const selectedItems = items.filter(item => item.value === true).map(item => item.id)
        setChecked(selectedItems)
    }, [items])


    const onCheck = useCallback(
        (checkedStutus: boolean, id: string) => {
            if (isDone(id)) return
            if (checkedStutus) {
                setChecked([...checked, id]);
            } else {
                setChecked(checkedExclude(id));
            }
        }, [checked, checkedExclude, isDone])

    const onCheckAll = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                setChecked(
                    itemsIds.filter(id => !(isDone(id) && !isChecked(id))))
            } else {
                setChecked(itemsIds.filter(id => isDone(id) && isChecked(id)))
            }

        }, [isChecked, isDone, itemsIds])

    const onDone = useCallback(
        (event: ChangeEvent<HTMLInputElement>, id: string) => {
            if (Boolean(event.target.checked)) {
                setDone([...done, id]);
            } else {
                setDone(doneExclude(id));
            }
        }, [done, doneExclude])

    const compatibleFilters = useMemo((): FilterTag[] => {
        const filters: FilterTag[] = Object.values(FilterTag)
        let compatibleFilters = filters as FilterTag[]
        if (selectedFilter.length === 0) {
            setSelectedFilter([FilterTag.ALL])
            compatibleFilters = filters.filter(tag => tag !== FilterTag.ALL)
        }
        if (selectedFilter.includes(FilterTag.ALL) && selectedFilter.length === 1) {
            compatibleFilters = filters.filter(tag => tag !== FilterTag.ALL)
        } else if (selectedFilter.includes(FilterTag.ALL) && selectedFilter.length > 1) {
            setSelectedFilter([FilterTag.ALL])
            compatibleFilters = filters.filter(tag => tag !== FilterTag.ALL)
        }
        if (selectedFilter.includes(FilterTag.DONE)) { }
        if (selectedFilter.includes(FilterTag.ORIGINAL)) {
            compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.NEW)
        } else
            if (selectedFilter.includes(FilterTag.NEW)) {
                if (selectedFilter.includes(FilterTag.ORIGINAL)) {
                    compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.NEW)
                }
                compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.ORIGINAL)
            }
        if (selectedFilter.includes(FilterTag.SELECTED)) {
            compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.UNSELECTED)
        } else
            if (selectedFilter.includes(FilterTag.UNSELECTED)) {
                if (selectedFilter.includes(FilterTag.SELECTED)) {
                    compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.UNSELECTED)
                }
                compatibleFilters = compatibleFilters.filter(tag => tag !== FilterTag.SELECTED)
            }

        return compatibleFilters
    }, [selectedFilter])

    const getFilteredItems = useCallback(() => {
        let filteredItems: Item[] = items
        selectedFilter.forEach(filter => {
            switch (filter) {
                case FilterTag.ALL: break;
                case FilterTag.DONE:
                    filteredItems = filteredItems.filter(item => isDone(item.id))
                    break;
                case FilterTag.ORIGINAL:
                    filteredItems = filteredItems.filter(item => isOriginal(item.id))
                    break;
                case FilterTag.NEW:
                    filteredItems = filteredItems.filter(item => isNew(item.id))
                    break;
                case FilterTag.SELECTED:
                    filteredItems = filteredItems.filter(item => isChecked(item.id))
                    break;
                case FilterTag.UNSELECTED:
                    filteredItems = filteredItems.filter(item => isUnchecked(item.id))
                    break;

            }
        })
        return filteredItems
    }, [items, selectedFilter, isOriginal, isNew, isChecked, isUnchecked, isDone])

    const AddBtn = useMemo(() => (
        <Box align='center' direction='row' pad="small" >
            <Box round="full" overflow="hidden" >
                <Button primary size='small' icon={<Add />} onClick={
                    _e => {
                        setItems([...items, {
                            ...newItem,
                            id: `uuid-${items.length + 1}`
                        }])
                    }
                } />
            </Box>
        </Box>
    ), [items, newItem])

    const itemLabelEdit = useMemo(() => (
        <TextInput
            onChange={(e) => {
                setNewItem({
                    ...newItem,
                    label: e.target.value,
                    value: true
                })
            }}
            onKeyUp={e => {
                if (e.code === "Enter")
                    setItems([...items, {
                        ...newItem,
                        id: `uuid-${items.length + 1}`
                    }])
            }}
        />

    ), [items, newItem])

    const renderChip = useCallback((selection: string) => (
        <Button
            key={`chip-${selection}`
            }
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDeselectFilter(selection);
            }}
            onFocus={(event) => event.stopPropagation()}
        >
            < Box
                align="center"
                direction="row"
                gap="xsmall"
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
                margin="xsmall"
                background="light-3"
                round="large"
            >
                < Text size="small" > {selection}</Text >
                < Box round="full" margin={{ left: 'xsmall' }}>
                    < FormClose size="small" style={{ width: '12px', height: '12px' }} />
                </Box >
            </Box >
        </Button >
    ), [onDeselectFilter])

    return (
        <>
            <Heading size={'small'} level={3} textAlign='center' > {list.name} </Heading>
            <Box pad="small" align='center' direction='row' justify={'between'} >
                <Text
                    style={{ width: "15%" }}
                >{" Filters: "}</Text>
                <SelectMultiple
                    style={{ flexGrow: 2, minHeight: "40px" }}
                    valueLabel={option => (
                        <Box wrap direction="row" width="medium">{
                            option.map((i: string) =>
                                [...compatibleFilters, FilterTag.ALL].includes(i as FilterTag) && renderChip(i)
                            )
                        }</Box>
                    )}
                    options={compatibleFilters}
                    value={selectedFilter}
                    onChange={({ value }: {
                        value: FilterTag[]
                    }) => {
                        setSelectedFilter([...value]);
                    }}
                />

            </Box>
            <Box overflow={"auto"} ref={tableBoxRef} >
                <Scrollbars
                    thumbMinSize={10}
                    style={{
                        width: (tableBoxRef.current as unknown as HTMLDivElement)?.offsetWidth || "600px",
                        height: (tableBoxRef.current as unknown as HTMLDivElement)?.offsetHeight || "300px",

                    }} >
                    <DataTable
                        style={{
                            marginRight: "10px"
                        }}
                        columns={[
                            {
                                property: "id",
                                size: "20%",
                                align: "center",
                                header: <Text>{"uuid"}</Text>,
                                render: ({ addItemElement, id }) =>
                                    <>{
                                        addItemElement ||
                                        <Text>{id}</Text>
                                    }</>
                            },
                            {
                                property: "checkbox",
                                size: "5%",
                                header: <CheckBox onChange={onCheckAll} />,
                                render: ({ checkboxElement, id }) =>
                                    <>{
                                        checkboxElement ||
                                        <CheckBox
                                            key={id}
                                            checked={isChecked(id)}
                                            onChange={(e) => { onCheck(e.target.checked, id) }}
                                        />
                                    }</>,
                                sortable: false,
                            },
                            {
                                property: "label",
                                header: <Text>{"Task"}</Text>,
                                render: ({ id, label, labelElement }) =>
                                    <>{
                                        labelElement || (

                                            isDone(id)
                                                ? <Text
                                                    style={{
                                                        backgroundColor: "black",
                                                        borderRadius: "10px",
                                                        paddingLeft: "10px"
                                                    }}
                                                >{label}</Text>
                                                : (<Text>{label}</Text>)
                                        )
                                    }</>
                            },
                            {
                                property: "done",
                                size: "5%",
                                header: (<Text>{"Done"}</Text>),
                                render: ({ id, doneElement }) =>
                                    <>{
                                        doneElement ||
                                        <CheckBox
                                            key={id}
                                            checked={isDone(id)}
                                            onChange={(e) => { onDone(e, id) }}
                                        />
                                    }</>,
                                sortable: false,
                                align: "center"
                            },
                        ]}
                        data={
                            [
                                {
                                    addItemElement: AddBtn,
                                    checkboxElement: <CheckBox disabled checked />,
                                    labelElement: itemLabelEdit,
                                    doneElement: <CheckBox disabled checked={false} />
                                },
                                ...getFilteredItems()
                            ] as ItemRow[]

                        }
                    />
                </Scrollbars>
            </Box>
        </>

    )
}
export { ExList }