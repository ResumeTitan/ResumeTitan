<script lang="ts">
  import clerkUI from '$lib/utils/clerkUI';
  import { showAuthModal, authStore } from '$lib/stores/auth';

  function closeModal() {
    authStore.closeAuthModal();
  }
</script>

{#if $showAuthModal}
  <div class="backdrop" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()} role="button" tabindex="0">
    <div class="modal" on:click|stopPropagation on:keydown|stopPropagation role="dialog" aria-modal="true" tabindex="-1">
      <button class="close-btn" on:click={closeModal} aria-label="Close modal">
        &times;
      </button>
      <div
        class="clerk-container"
        use:clerkUI={{
          componentType: 'SignIn',
          props: {
            appearance: {
              variables: {
                colorPrimary: '#115E59',
                colorTextOnPrimaryBackground: '#ffffff',
                borderRadius: '8px'
              },
              elements: {
                formButtonPrimary: {
                  backgroundColor: '#115E59',
                  '&:hover': {
                    backgroundColor: '#0b3733'
                  }
                }
              }
            }
          }
        }}
      ></div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .modal {
    position: relative;
    border-radius: 12px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .close-btn {
    position: absolute;
    top: 0.7rem;
    right: 2rem;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #fff;
    line-height: 1;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
    z-index: 10;
  }

  .close-btn:hover {
    background: rgba(255, 8, 8, 0.7);
  }

  .clerk-container {
    border-radius: 12px;
    overflow: hidden;
  }
</style>
