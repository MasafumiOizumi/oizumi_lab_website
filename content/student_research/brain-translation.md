---
title: 脳と脳の直接的な情報伝達に向けた数理技術の開発と検証
weight: 20
description: >-
  脳内の神経活動の中には、私たちの知覚、思考、感情など様々な情報が埋め込まれています。本研究室では、脳活動データから抽出した情報を脳と脳の間で直接伝達するために必要な数理技術の開発を行っています。


  脳と脳との直接的な情報伝達の実現には、単に個別の脳ごとに情報を読み取るだけでなく、異なる脳の間での情報の対応づけ、「翻訳」の技術が必要です。2つの脳活動の対応関係を取る方法としては、2つの脳活動で共通の神経多様体空間に射影して、その射影した空間で対応する活動がなるべく近くなるように「揃える」(アラインメント)という操作を行う方法があります。数学的には、AさんとBさんの対応する脳活動をそれぞれ$R_A, R_B$、共通の空間への射影を$f, g$とした時、$f(R_A)$と$g(R_B)$の距離がなるべく小さくなるようにアラインメントする行列$Q$を求める最適化問題($\min |f(R_A) - Q g(R_B)|$)になります。


  上で説明した翻訳の方法は、異なる脳活動の間の対応関係の情報がある場合の基本的な方法ですが、あらかじめ対応関係が明らかでない状況で、2つの脳活動の間の「翻訳」を行いたいケースも存在します。この場合は、教師なしアラインメントと呼ばれる方法論が必要となります。自然言語処理の分野は、この教師なしアラインメントの技術を適用することにより、2つの異なる言語(日本語 vs 英語など)の間で、単語間の対応関係をあらかじめ与えずに、高精度の翻訳が実現できることが示されています。我々はこの方法論を脳活動同士の「翻訳」にも援用することができるのではないかと考えており、Gromov-Wasserstein最適輸送と呼ばれる手法を用いて脳活動同士の翻訳を試みています。


  本研究室では、単に数理技術を開発するだけでなく、実験研究者との共同研究により、脳活動データの解析によって提案手法の有効性の実証も行っています。
image: https://res.cloudinary.com/dvee1a4ol/image/upload/v1764852994/BtoB_communication_brb06a.png
references: []
references_en:
  - 'Is my "red" your "red"?: Evaluating structural correspondences between
    color similarity judgments using unsupervised alignment.'
  - "Unsupervised Alignment in Neuroscience: Introducing a Toolbox for
    Gromov-Wasserstein Optimal Transport"
  - Investigating Fine-and Coarse-grained Structural Correspondences Between
    Deep Neural Networks and Human Object Image Similarity Judgments Using
    Unsupervised Alignment.
  - Unsupervised alignment reveals structural commonalities and differences in
    neural representations of natural scenes across individuals and brain areas
---
