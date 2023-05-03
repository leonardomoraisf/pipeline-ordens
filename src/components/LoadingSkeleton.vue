<template>
  <main class="flex-1 overflow-hidden">
    <div class="flex flex-col h-full overflow-hidden">
      <div class="flex-1 overflow-hidden mt-8">
        <div class="inline-flex h-full items-start px-4 pb-4">
          <div class="w-72 flex flex-col rounded-md py-2 max-h-full">
            <div>
              <div>
                <div class="mb-0 relative">
                  <div class="flex items-center">
                    <div class="flex w-full h-0 bg-animation"></div>
                    <div
                      class="z-10 flex items-center justify-center w-6 h-6 p-5 rounded-full shrink-0 group-hover:scale-110 status-circle bg-animation"
                    >
                      <p></p>
                    </div>
                    <div class="flex w-full h-0.5 bg-animation"></div>
                  </div>

                  <div class="mt-3 flex justify-center">
                    <p class="h-4 w-10/12 bg-animation rounded-md"></p>
                  </div>
                </div>
              </div>

              <div>
                <div class="px-2">
                  <div
                    class="mt-6 w-full flex justify-center items-center py-6 border-2 rounded-md text-zinc-200 add-card"
                  >
                    <font-awesome-icon
                      class="w-5 h-5"
                      :icon="['fas', 'fa-plus']"
                    />
                    <span class="font-semibold ml-1"></span>
                  </div>
                </div>
              </div>

              <div class="pb-3 flex flex-col overflow-hidden mt-6">
                <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
                  <ul class="space-y-3 pb-32 h-full draggable">
                    <li>
                      <div
                        class="group relative p-3 shadow rounded-md border-b border-gray-300 bg-animation drag-card text-left"
                      >
                        <div class="h-28 font-semibold space-y-2">
                          <p
                            class="h-4 w-10/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="h-4 w-8/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="absolute bottom-2 right-2 h-4 w-4/12 bg-animation-dark rounded-md"
                          ></p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div
                        class="group relative p-3 shadow rounded-md border-b border-gray-300 bg-animation drag-card text-left"
                      >
                        <div class="h-28 font-semibold space-y-2">
                          <p
                            class="h-4 w-10/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="h-4 w-8/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="absolute bottom-2 right-2 h-4 w-4/12 bg-animation-dark rounded-md"
                          ></p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div
                        class="group relative p-3 shadow rounded-md border-b border-gray-300 bg-animation drag-card text-left"
                      >
                        <div class="h-28 font-semibold space-y-2">
                          <p
                            class="h-4 w-10/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="h-4 w-8/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="absolute bottom-2 right-2 h-4 w-4/12 bg-animation-dark rounded-md"
                          ></p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="w-72 flex flex-col rounded-md py-2 max-h-full">
            <div>
              <div>
                <div class="mb-0 relative">
                  <div class="flex items-center">
                    <div class="flex w-full h-0.5 bg-animation"></div>
                    <div
                      class="z-10 flex items-center justify-center w-6 h-6 p-5 rounded-full shrink-0 group-hover:scale-110 status-circle bg-animation"
                    >
                      <p></p>
                    </div>
                    <div class="flex w-full h-0.5 bg-animation"></div>
                  </div>

                  <div class="mt-3 flex justify-center">
                    <p class="h-4 w-9/12 bg-animation rounded-md"></p>
                  </div>
                </div>
              </div>

              <div>
                <div class="px-2">
                  <div
                    class="mt-6 w-full flex justify-center items-center py-6 border-2 rounded-md text-zinc-200 add-card"
                  >
                    <font-awesome-icon
                      class="w-5 h-5"
                      :icon="['fas', 'fa-plus']"
                    />
                    <span class="font-semibold ml-1"></span>
                  </div>
                </div>
              </div>

              <div class="pb-3 flex flex-col overflow-hidden mt-6">
                <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
                  <ul class="space-y-3 pb-32 h-full draggable">
                    <li>
                      <div
                        class="group relative p-3 shadow rounded-md border-b border-gray-300 bg-animation drag-card text-left"
                      >
                        <div class="h-28 font-semibold space-y-2">
                          <p
                            class="h-4 w-10/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="h-4 w-8/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="absolute bottom-2 right-2 h-4 w-4/12 bg-animation-dark rounded-md"
                          ></p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div
                        class="group relative p-3 shadow rounded-md border-b border-gray-300 bg-animation drag-card text-left"
                      >
                        <div class="h-28 font-semibold space-y-2">
                          <p
                            class="h-4 w-10/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="h-4 w-8/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="absolute bottom-2 right-2 h-4 w-4/12 bg-animation-dark rounded-md"
                          ></p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="w-72 flex flex-col rounded-md py-2 max-h-full">
            <div>
              <div>
                <div class="mb-0 relative">
                  <div class="flex items-center">
                    <div class="flex w-full h-0.5 bg-animation"></div>
                    <div
                      class="z-10 flex items-center justify-center w-6 h-6 p-5 rounded-full shrink-0 group-hover:scale-110 status-circle bg-animation"
                    >
                      <p></p>
                    </div>
                    <div class="flex w-full h-0.5 bg-animation"></div>
                  </div>

                  <div class="mt-3 flex justify-center">
                    <p class="h-4 w-8/12 bg-animation rounded-md"></p>
                  </div>
                </div>
              </div>

              <div>
                <div class="px-2">
                  <div
                    class="mt-6 w-full flex justify-center items-center py-6 border-2 rounded-md text-zinc-200 add-card"
                  >
                    <font-awesome-icon
                      class="w-5 h-5"
                      :icon="['fas', 'fa-plus']"
                    />
                    <span class="font-semibold ml-1"></span>
                  </div>
                </div>
              </div>

              <div class="pb-3 flex flex-col overflow-hidden mt-6">
                <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
                  <ul class="space-y-3 pb-32 h-full draggable">
                    <li>
                      <div
                        class="group relative p-3 shadow rounded-md border-b border-gray-300 bg-animation drag-card text-left"
                      >
                        <div class="h-28 font-semibold space-y-2">
                          <p
                            class="h-4 w-10/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="h-4 w-8/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="absolute bottom-2 right-2 h-4 w-4/12 bg-animation-dark rounded-md"
                          ></p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="w-72 flex flex-col rounded-md py-2 max-h-full">
            <div>
              <div>
                <div class="mb-0 relative">
                  <div class="flex items-center">
                    <div class="flex w-full h-0.5 bg-animation"></div>
                    <div
                      class="z-10 flex items-center justify-center w-6 h-6 p-5 rounded-full shrink-0 group-hover:scale-110 status-circle bg-animation"
                    >
                      <p></p>
                    </div>
                    <div class="flex w-full h-0 bg-animation"></div>
                  </div>

                  <div class="mt-3 flex justify-center">
                    <p class="h-4 w-full bg-animation rounded-md"></p>
                  </div>
                </div>
              </div>

              <div>
                <div class="px-2">
                  <div
                    class="mt-6 w-full flex justify-center items-center py-6 border-2 rounded-md text-zinc-200 add-card"
                  >
                    <font-awesome-icon
                      class="w-5 h-5"
                      :icon="['fas', 'fa-plus']"
                    />
                    <span class="font-semibold ml-1"></span>
                  </div>
                </div>
              </div>

              <div class="pb-3 flex flex-col overflow-hidden mt-6">
                <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
                  <ul class="space-y-3 pb-32 h-full draggable">
                    <li>
                      <div
                        class="group relative p-3 shadow rounded-md border-b border-gray-300 bg-animation drag-card text-left"
                      >
                        <div class="h-28 font-semibold space-y-2">
                          <p
                            class="h-4 w-10/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="h-4 w-8/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="absolute bottom-2 right-2 h-4 w-4/12 bg-animation-dark rounded-md"
                          ></p>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div
                        class="group relative p-3 shadow rounded-md border-b border-gray-300 bg-animation drag-card text-left"
                      >
                        <div class="h-28 font-semibold space-y-2">
                          <p
                            class="h-4 w-10/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="h-4 w-8/12 bg-animation-dark rounded-md"
                          ></p>
                          <p
                            class="absolute bottom-2 right-2 h-4 w-4/12 bg-animation-dark rounded-md"
                          ></p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col rounded-md py-2 max-h-full w-72">
            <div>
              <div class="relative mb-6 sm:mb-0 add">
                <div class="flex items-center justify-center">
                  <div
                    class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-zinc-200 text-zinc-200 p-4 shrink-0"
                  >
                    <font-awesome-icon :icon="['fas', 'fa-plus']" />
                  </div>
                </div>
                <div class="mt-3 flex justify-center text-center">
                  <h3 class="text-lg font-semibold"></h3>
                </div>
              </div>
            </div>

            <ul
              class="relative space-y-12 mt-32 w-full h-screen flex justify-center items-center text-center border-2 rounded-md font-semibold text-xl"
            >
              <p class="absolute bg-animation h-5 w-11/12 rounded-md"></p>
              <p class="absolute bg-animation h-5 w-8/12 rounded-md"></p>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-animation {
  background-color: #eee;
  animation: pulse-bg 1s infinite;
}

.bg-animation-dark {
  background-color: #d4d4d8;
  animation: pulse-bg-dark 1s infinite;
}

@keyframes pulse-bg {
  0% {
    background-color: #eee;
  }

  50% {
    background: #eaeaea;
  }

  100% {
    background-color: #eee;
  }
}

@keyframes pulse-bg-dark {
  0% {
    background-color: #d4d4d8;
  }

  50% {
    background-color: #c8c8cb;
  }

  100% {
    background-color: #d4d4d8;
  }
}
</style>