<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { CertificateType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import DateInput from '$components/forms/DateInput.svelte';

    export let certificate: CertificateType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: CertificateType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', certificate);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof CertificateType, value: any) {
        certificate = { ...certificate, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {certificate.name || 'New Certificate'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="certificate-name"
                    label="Certificate Name"
                    value={certificate.name}
                    placeholder="AWS Certified Solutions Architect"
                    {disabled}
                    on:input={e => updateField('name', e.detail)}
                />

                <FormField
                    id="certificate-issuer"
                    label="Issuer"
                    value={certificate.issuer}
                    placeholder="Amazon Web Services"
                    {disabled}
                    on:input={e => updateField('issuer', e.detail)}
                />

                <DateInput
                    id="certificate-date"
                    label="Date Issued"
                    value={certificate.date}
                    {disabled}
                    on:change={e => updateField('date', e.detail)}
                />

                <FormField
                    id="certificate-url"
                    label="URL"
                    type="url"
                    value={certificate.url}
                    placeholder="https://www.credential.net/..."
                    {disabled}
                    on:input={e => updateField('url', e.detail)}
                />
            </div>

            <div class="flex justify-between mt-6">
                <button type="button" class="btn-secondary" on:click={handleDelete}>
                    Delete
                </button>
                <div class="flex gap-2">
                    <button type="button" class="btn-add" on:click={handleCancel}>
                        Cancel
                    </button>
                    <button type="button" class="btn-primary" on:click={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
