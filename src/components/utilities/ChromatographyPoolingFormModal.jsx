import React, { useState } from 'react'

import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import ChromatographyPoolingForm from './ChromatographyPoolingForm';

const ChromatographyPoolingFormModal = (
	{
		activity,
		onResolvePooling
	}) => {

	const [showModal, setShowModal] = useState(false)
	const toggleModal = () => { setShowModal(!showModal) }

	const handleResolvePooling = (fractions) => {
		toggleModal()
		onResolvePooling(fractions)
	}

	return (
		<>
			<Button onClick={toggleModal} disabled={!activity.id}>
				Select Fractions
			</Button>
			{!activity.id &&
				<div>Please save action before resolving Fractions</div>
			}
			<Modal
				className={'d-flex align-items-center justify-content-center modal--primary modal-xl'}
				isOpen={showModal}
				autoFocus={true}
				toggle={toggleModal}
				backdrop={"static"}
			>
				<ModalHeader>Select Fractions From Automation Result</ModalHeader>
				<ModalBody>
					<ChromatographyPoolingForm
						activity={activity}
						onSave={handleResolvePooling}
						onCancel={toggleModal}
					/>
				</ModalBody>
			</Modal>
		</>
	)
}

export default ChromatographyPoolingFormModal
