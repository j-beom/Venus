import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub 저장소 이름이 'Venus'인 경우 반드시 /Venus/ 여야 합니다.
  base: '/Venus/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 빌드 시 기존 dist 폴더 삭제
    emptyOutDir: true,
    // 소스맵 제외하여 빌드 속도 및 용량 최적화
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        // 에셋 파일 이름 형식을 명확히 지정
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  },
  resolve: {
    alias: {
      // 필요한 경우 별칭 설정
      '@': '/src',
    },
  },
});