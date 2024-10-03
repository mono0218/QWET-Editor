export default function TimeLineCanvas({
                                           canvas,
                                           timelineWrapper,
                                       }: {
    canvas: HTMLCanvasElement;
    timelineWrapper: HTMLDivElement;
}) {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Canvasサイズ設定
    canvas.width = 40000; // 表示範囲に合わせる
    canvas.height = 300;

    let time = 0;

    const totalTime = 100; // 全体の時間（仮の時間）
    const trackCount = 6; // トラックの数
    let scrollOffset = 0; // スクロールオフセット

    // メモリ表示のための余白（上部パディング）
    const topPadding = 20; // 上部に20pxの余白を作る

    // 各トラックの高さ
    const trackHeight = canvas.height / trackCount;

    // クリップのインターフェース
    interface Clip {
        track: number;
        start: number;
        end: number;
        isDragging?: boolean; // ドラッグ中かどうかのフラグ
    }

    // クリップの配列
    const clips: Clip[] = [
        { track: 0, start: 5, end: 20 },
        { track: 1, start: 10, end: 30 },
        { track: 2, start: 15, end: 40 },
        { track: 3, start: 20, end: 50 },
        { track: 4, start: 25, end: 60 },
    ];

    let isDragging = false; // クリップをドラッグ中か
    let selectedClip: Clip | null = null; // 選択されたクリップ

    // 水平線を描画する関数
    function drawHorizontalLines(): void {
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;

        for (let i = 0; i < trackCount; i++) {
            const y = i * trackHeight + topPadding; // Y座標をtopPadding分ずらす
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // タイムインジケーター（メモリ）を描画する関数
    function drawTimeIndicators(scrollOffset: number): void {
        const step = 100; // 100pxごとにメモリを表示

        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';

        for (let i = -scrollOffset; i < canvas.width + scrollOffset; i += step) {
            const x = i + scrollOffset;
            const timeLabel = ((x + scrollOffset) / 100).toFixed(1); // ラベルを表示

            // 縦線を描画
            ctx.beginPath();
            ctx.moveTo(x, topPadding); // 余白に合わせてY位置を調整
            ctx.lineTo(x, topPadding + 10); // 高さ10pxの線を引く
            ctx.stroke();

            // 数値ラベルをメモリの上に描画
            ctx.fillText(timeLabel, x - 5, topPadding - 5); // ラベルを少し上に配置
        }
    }

    // タイムラインの縦の線（グリッド）を描画する関数
    function drawVerticalGrid(scrollOffset: number): void {
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 0.5;

        for (let i = -scrollOffset; i < canvas.width + scrollOffset; i += 10) {
            const x = i + scrollOffset;
            if ((x + scrollOffset) % 100 === 0) {
                // 1秒ごとの部分にだけ太い縦線を描画
                ctx.strokeStyle = '#888';
                ctx.lineWidth = 1;
            } else {
                ctx.strokeStyle = '#444';
                ctx.lineWidth = 0.5;
            }
            ctx.beginPath();
            ctx.moveTo(x, topPadding + 10); // メモリの下から始まるように
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    // タイムバーを描画する関数
    function drawTimeBar(currentTime: number, scrollOffset: number): void {
        const x = (currentTime / totalTime) * canvas.width - scrollOffset;
        ctx.strokeStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(x, topPadding); // topPadding分下に描画
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // クリップを描画する関数
    function drawClips(scrollOffset: number): void {
        clips.forEach((clip) => {
            const { track, start, end } = clip;
            const xStart = (start / totalTime) * canvas.width - scrollOffset;
            const xEnd = (end / totalTime) * canvas.width - scrollOffset;
            const y = track * trackHeight + topPadding; // topPadding分Y座標をずらす

            // クリップの描画
            ctx.fillStyle = '#1E90FF';
            ctx.fillRect(xStart, y + 5, xEnd - xStart, trackHeight - 10);
        });
    }

    // 描画の更新関数
    function render(currentTime: number): void {
        // 画面をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // メモリ表示の描画
        drawTimeIndicators(scrollOffset);
        drawHorizontalLines();
        drawVerticalGrid(scrollOffset);
        drawClips(scrollOffset);
        drawTimeBar(currentTime, scrollOffset);
    }

    // マウスダウンイベントでドラッグを開始
    canvas.addEventListener('mousedown', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clip = getClipAtPosition(x, y);
        if (clip) {
            isDragging = true;
            selectedClip = clip;
        }
    });

    // クリップをクリックしたか判定する関数
    function getClipAtPosition(x: number, y: number): Clip | null {
        for (const clip of clips) {
            const xStart = (clip.start / totalTime) * canvas.width - scrollOffset;
            const xEnd = (clip.end / totalTime) * canvas.width - scrollOffset;
            const clipYStart = clip.track * trackHeight;
            const clipYEnd = clipYStart + trackHeight;

            if (x >= xStart && x <= xEnd && y - topPadding >= clipYStart && y - topPadding <= clipYEnd) {
                return clip;
            }
        }
        return null;
    }

    // マウス移動イベントでクリップを移動
    canvas.addEventListener('mousemove', (event) => {
        if (isDragging && selectedClip) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;

            // ドラッグ中のクリップの開始位置と終了位置を更新
            const newStart = (x / canvas.width) * totalTime + scrollOffset / canvas.width * totalTime;
            const clipLength = selectedClip.end - selectedClip.start;
            selectedClip.start = newStart;
            selectedClip.end = newStart + clipLength;

            // 再描画
            render(0);
        }
    });

    // マウスアップイベントでドラッグを終了
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        selectedClip = null;
    });

    // スクロールイベントに応じて描画を更新
    timelineWrapper.addEventListener('scroll', () => {
        scrollOffset = timelineWrapper.scrollLeft;
        render(time);
    });

    // 60fpsでレンダリングを実行するためのループ
    function update() {
        render(time);
        time += 0.1;
        requestAnimationFrame(update);
    }

    update();
}
