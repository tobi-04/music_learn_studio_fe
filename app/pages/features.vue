<template>
  <PublicLayout>
    <div class="container mx-auto px-4 py-16">
      <!-- Hero Section -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h1 class="text-5xl font-bold mb-6">All Features in One Platform</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Everything you need to learn, create, and share music
        </p>
      </div>

      <!-- Learning Features -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-3">📚 Learning System</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Comprehensive music education platform
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">📖</div>
              <h3 class="text-xl font-semibold mb-3">Structured Courses</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Music theory from basics to advanced</li>
                <li>✓ Instrument-specific lessons</li>
                <li>✓ Video tutorials & demonstrations</li>
                <li>✓ Interactive examples</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">📊</div>
              <h3 class="text-xl font-semibold mb-3">Progress Tracking</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Track completed lessons</li>
                <li>✓ Monitor learning statistics</li>
                <li>✓ View time spent learning</li>
                <li>✓ Completion percentages</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">🎓</div>
              <h3 class="text-xl font-semibold mb-3">Multi-Level Content</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Beginner-friendly courses</li>
                <li>✓ Intermediate challenges</li>
                <li>✓ Advanced masterclasses</li>
                <li>✓ Personalized recommendations</li>
              </ul>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Studio Features -->
      <div class="mb-20 bg-primary-50 dark:bg-primary-900/10 py-16 -mx-4 px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-3">🎹 Music Creation Studio</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Professional tools in your browser
          </p>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">🎼</div>
              <h3 class="text-lg font-semibold mb-3">Visual Composer</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Drag-and-drop interface</li>
                <li>✓ Piano roll editor</li>
                <li>✓ Multiple tracks</li>
                <li>✓ Real-time preview</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">🎸</div>
              <h3 class="text-lg font-semibold mb-3">Instruments</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Piano/Keyboard</li>
                <li>✓ Guitar</li>
                <li>✓ Drums</li>
                <li>✓ More coming soon</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">⚙️</div>
              <h3 class="text-lg font-semibold mb-3">Controls</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Adjustable BPM/Tempo</li>
                <li>✓ Key selection (C, D, E...)</li>
                <li>✓ Scale modes (Major, Minor...)</li>
                <li>✓ Volume & mix controls</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">💾</div>
              <h3 class="text-lg font-semibold mb-3">Export Options</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ MP3 export</li>
                <li>✓ MIDI export</li>
                <li>✓ Save as project</li>
                <li>✓ Cloud storage</li>
              </ul>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Recording Features -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-3">🎤 Recording Studio</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Capture your musical ideas
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">🎙️</div>
              <h3 class="text-xl font-semibold mb-3">Audio Recording</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Microphone recording</li>
                <li>✓ Browser-based capture</li>
                <li>✓ High-quality audio</li>
                <li>✓ No software installation</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">🎚️</div>
              <h3 class="text-xl font-semibold mb-3">Audio Processing</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Gain adjustment</li>
                <li>✓ Noise reduction</li>
                <li>✓ Basic EQ controls</li>
                <li>✓ Waveform visualization</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">📁</div>
              <h3 class="text-xl font-semibold mb-3">File Management</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Save recordings</li>
                <li>✓ Upload audio files</li>
                <li>✓ Organize by project</li>
                <li>✓ Share with others</li>
              </ul>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Social Features -->
      <div class="mb-20 bg-gray-100 dark:bg-gray-800 py-16 -mx-4 px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-3">🌐 Community & Sharing</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Connect with fellow musicians
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">🚀</div>
              <h3 class="text-lg font-semibold mb-3">Publish</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Share compositions</li>
                <li>✓ Public profiles</li>
                <li>✓ Portfolio showcase</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">❤️</div>
              <h3 class="text-lg font-semibold mb-3">Engage</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Like tracks</li>
                <li>✓ Comment system</li>
                <li>✓ Follow artists</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">🔥</div>
              <h3 class="text-lg font-semibold mb-3">Discover</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Trending music</li>
                <li>✓ Genre filters</li>
                <li>✓ Top charts</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">🎭</div>
              <h3 class="text-lg font-semibold mb-3">Genres</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ EDM</li>
                <li>✓ Lo-Fi</li>
                <li>✓ Classical</li>
                <li>✓ And more...</li>
              </ul>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Admin Features -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-3">👨‍💼 Admin Dashboard</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Complete control and insights
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">📚</div>
              <h3 class="text-xl font-semibold mb-3">Course Management</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Create/Edit courses</li>
                <li>✓ Manage chapters</li>
                <li>✓ Upload materials</li>
                <li>✓ Publish/Unpublish</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">📈</div>
              <h3 class="text-xl font-semibold mb-3">Analytics</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Student statistics</li>
                <li>✓ Revenue tracking</li>
                <li>✓ Popular courses</li>
                <li>✓ Engagement metrics</li>
              </ul>
            </div>
          </UCard>

          <UCard>
            <div class="p-4">
              <div class="text-4xl mb-4">👥</div>
              <h3 class="text-xl font-semibold mb-3">User Management</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ View all students</li>
                <li>✓ Enrollment tracking</li>
                <li>✓ Progress monitoring</li>
                <li>✓ Support tools</li>
              </ul>
            </div>
          </UCard>
        </div>
      </div>

      <!-- CTA Section -->
      <div
        class="text-center py-16 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-2xl">
        <h2 class="text-4xl font-bold mb-4">
          Ready to Experience All Features?
        </h2>
        <p class="text-xl mb-8 opacity-90">
          Join MusicLearn Studio today and unlock your musical potential
        </p>
        <div class="flex justify-center gap-4">
          <UButton
            size="xl"
            class="bg-white text-primary-600 hover:bg-gray-100"
            @click="navigateTo('/auth/register')">
            Start Free Trial
          </UButton>
          <UButton
            size="xl"
            variant="outline"
            class="border-white text-white hover:bg-white/10"
            @click="navigateTo('/courses')">
            Browse Courses
          </UButton>
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
