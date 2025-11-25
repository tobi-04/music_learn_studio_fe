<template>
  <PublicLayout>
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-8">About MusicLearn Studio</h1>

        <!-- Mission Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            MusicLearn Studio is dedicated to making music education accessible
            to everyone. We believe that learning music should be interactive,
            engaging, and creative. Our platform combines structured learning
            with hands-on music creation, allowing students to not just learn
            theory, but to apply it immediately through composition.
          </p>
        </div>

        <!-- What We Offer -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-6">What We Offer</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <div class="flex items-start gap-4">
                <div class="text-3xl">📚</div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Structured Courses</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Comprehensive courses covering music theory, instruments,
                    and composition from beginner to advanced levels.
                  </p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-start gap-4">
                <div class="text-3xl">🎹</div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Music Studio</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Browser-based music creation studio with drag-and-drop
                    interface, multiple instruments, and real-time playback.
                  </p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-start gap-4">
                <div class="text-3xl">🎤</div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Recording Tools</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Record your voice or instruments directly in your browser
                    with professional audio processing features.
                  </p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-start gap-4">
                <div class="text-3xl">🌐</div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Community Sharing</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Share your compositions, discover trending music, and engage
                    with fellow music creators worldwide.
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Technology Stack -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">
            Built with Modern Technology
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-6">
            Our platform leverages cutting-edge web technologies to deliver a
            seamless music learning and creation experience:
          </p>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="text-primary-600 font-bold">•</span>
              <span
                ><strong>Web Audio API</strong> - Real-time audio synthesis and
                playback</span
              >
            </li>
            <li class="flex items-start gap-3">
              <span class="text-primary-600 font-bold">•</span>
              <span
                ><strong>Vue 3 & Nuxt 3</strong> - Modern, reactive user
                interface</span
              >
            </li>
            <li class="flex items-start gap-3">
              <span class="text-primary-600 font-bold">•</span>
              <span
                ><strong>Spring Boot</strong> - Robust and scalable
                backend</span
              >
            </li>
            <li class="flex items-start gap-3">
              <span class="text-primary-600 font-bold">•</span>
              <span
                ><strong>Cloud Storage</strong> - Secure storage for your
                compositions and recordings</span
              >
            </li>
          </ul>
        </div>

        <!-- Values -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-6">Our Values</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              class="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div class="text-4xl mb-3">🎯</div>
              <h3 class="font-semibold mb-2">Accessibility</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Music education for everyone, regardless of background
              </p>
            </div>
            <div
              class="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div class="text-4xl mb-3">💡</div>
              <h3 class="font-semibold mb-2">Innovation</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Pushing boundaries with technology and pedagogy
              </p>
            </div>
            <div
              class="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div class="text-4xl mb-3">🤝</div>
              <h3 class="font-semibold mb-2">Community</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Building connections through shared musical passion
              </p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <h2 class="text-3xl font-bold mb-4">
            Ready to Start Your Musical Journey?
          </h2>
          <p class="text-lg mb-6 text-gray-600 dark:text-gray-400">
            Join thousands of students learning and creating music every day
          </p>
          <div class="flex justify-center gap-4">
            <UButton size="lg" @click="navigateTo('/auth/register')">
              Get Started Free
            </UButton>
            <UButton
              size="lg"
              variant="outline"
              @click="navigateTo('/courses')">
              Explore Courses
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
