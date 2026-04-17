import React from 'react';
import CatalogModal from '../CatalogModal/CatalogModal';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm';

/**
 * Fragment to render all modals used in the Catalogs page.
 */
const CatalogsModals = ({
    modalOpen,
    editTarget,
    categories,
    onSaveModal,
    onCloseModal,
    deleteTarget,
    onCloseDelete,
    onConfirmDelete
}) => {
    return (
        <>
            <CatalogModal 
                isOpen={modalOpen}
                category={editTarget}
                allFilteredCats={categories} 
                onSave={onSaveModal}
                onClose={onCloseModal}
            />

            <DeleteConfirm 
                isOpen={!!deleteTarget}
                category={deleteTarget}
                onClose={onCloseDelete}
                onConfirm={onConfirmDelete}
            />
        </>
    );
};

export default CatalogsModals;
